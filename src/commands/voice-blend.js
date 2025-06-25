import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { KitsAIService } from "../kits-service.js";

export async function voiceBlend(inputFile, options) {
  const spinner = ora("Initializing voice blending...").start();

  try {
    const service = new KitsAIService();

    if (!service.apiKey) {
      spinner.fail('No API key found. Run "kits-cli setup" first.');
      return;
    }

    let modelIds = [];
    let weights = [];

    // Parse command line options
    if (options.models && options.weights) {
      modelIds = options.models.split(",").map((id) => id.trim());
      weights = options.weights.split(",").map((w) => parseFloat(w.trim()));

      if (modelIds.length !== weights.length) {
        throw new Error("Number of model IDs must match number of weights");
      }

      if (weights.some((w) => w < 0 || w > 1)) {
        throw new Error("All weights must be between 0 and 1");
      }
    } else {
      // Interactive mode
      spinner.text = "Fetching available voice models...";
      const modelsResponse = await service.getVoiceModels(1, 20);

      if (!modelsResponse.data || modelsResponse.data.length === 0) {
        spinner.fail("No voice models available");
        return;
      }

      spinner.stop();

      const { selectedModels } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "selectedModels",
          message: "Choose voice models to blend (select 2-4):",
          choices: modelsResponse.data.map((model) => ({
            name: `${model.name} (ID: ${model.id})`,
            value: model.id,
          })),
          validate: (input) => {
            if (input.length < 2) {
              return "Please select at least 2 models";
            }
            if (input.length > 4) {
              return "Please select no more than 4 models";
            }
            return true;
          },
        },
      ]);

      modelIds = selectedModels;

      // Get weights for each model
      const weightPrompts = modelIds.map((modelId, index) => ({
        type: "input",
        name: `weight_${index}`,
        message: `Weight for model ${modelId} (0-1):`,
        default: (1 / modelIds.length).toFixed(2),
        validate: (input) => {
          const weight = parseFloat(input);
          if (isNaN(weight) || weight < 0 || weight > 1) {
            return "Weight must be a number between 0 and 1";
          }
          return true;
        },
      }));

      const weightAnswers = await inquirer.prompt(weightPrompts);
      weights = Object.values(weightAnswers).map((w) => parseFloat(w));

      spinner.start("Starting voice blending...");
    }

    spinner.text = `Blending ${modelIds.length} voices...`;

    const job = await service.voiceBlender(inputFile, modelIds, weights);

    spinner.text = `Job created (ID: ${job.id}). Waiting for completion...`;

    const completedJob = await service.pollJobStatus(
      job.id,
      "voice-blender",
      (status) => {
        spinner.text = `Job ${status.id}: ${status.status} (${
          status.progress || 0
        }%)`;
      }
    );

    if (completedJob.outputUrl) {
      const outputPath = options.output || `voice_blended_${Date.now()}.wav`;

      spinner.text = "Downloading result...";
      await service.downloadFile(completedJob.outputUrl, outputPath);

      spinner.succeed(
        `Voice blending completed! Output saved to: ${chalk.cyan(outputPath)}`
      );

      console.log(chalk.gray("\n📄 Job Details:"));
      console.log(chalk.gray(`  Job ID: ${completedJob.id}`));
      console.log(chalk.gray(`  Status: ${completedJob.status}`));
      console.log(chalk.gray(`  Input: ${inputFile}`));
      console.log(chalk.gray(`  Models: ${modelIds.join(", ")}`));
      console.log(chalk.gray(`  Weights: ${weights.join(", ")}`));
      console.log(chalk.gray(`  Output: ${outputPath}\n`));
    } else {
      spinner.warn("Job completed but no output URL provided");
    }
  } catch (error) {
    spinner.fail(`Voice blending failed: ${error.message}`);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    }
  }
}
