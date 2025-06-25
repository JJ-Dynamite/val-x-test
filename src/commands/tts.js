import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { KitsAIService } from "../kits-service.js";

export async function textToSpeech(text, options) {
  const spinner = ora("Initializing text-to-speech...").start();

  try {
    const service = new KitsAIService();

    if (!service.apiKey) {
      spinner.fail('No API key found. Run "kits-cli setup" first.');
      return;
    }

    let modelId = options.modelId;

    // If no model ID provided, let user choose
    if (!modelId) {
      spinner.text = "Fetching available voice models...";
      const modelsResponse = await service.getVoiceModels(1, 10);

      if (!modelsResponse.data || modelsResponse.data.length === 0) {
        spinner.fail("No voice models available");
        return;
      }

      spinner.stop();

      const { selectedModel } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedModel",
          message: "Choose a voice model for TTS:",
          choices: modelsResponse.data.map((model) => ({
            name: `${model.name} (ID: ${model.id})`,
            value: model.id,
          })),
        },
      ]);

      modelId = selectedModel;
      spinner.start("Starting text-to-speech conversion...");
    }

    spinner.text = `Converting text to speech using model ${modelId}...`;

    const job = await service.textToSpeech(text, modelId);

    spinner.text = `Job created (ID: ${job.id}). Waiting for completion...`;

    const completedJob = await service.pollJobStatus(
      job.id,
      "text-to-speech",
      (status) => {
        spinner.text = `Job ${status.id}: ${status.status} (${
          status.progress || 0
        }%)`;
      }
    );

    if (completedJob.outputUrl) {
      const outputPath = options.output || `tts_output_${Date.now()}.wav`;

      spinner.text = "Downloading result...";
      await service.downloadFile(completedJob.outputUrl, outputPath);

      spinner.succeed(
        `Text-to-speech completed! Output saved to: ${chalk.cyan(outputPath)}`
      );

      console.log(chalk.gray("\n📄 Job Details:"));
      console.log(chalk.gray(`  Job ID: ${completedJob.id}`));
      console.log(chalk.gray(`  Status: ${completedJob.status}`));
      console.log(chalk.gray(`  Model: ${modelId}`));
      console.log(
        chalk.gray(
          `  Text: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`
        )
      );
      console.log(chalk.gray(`  Output: ${outputPath}\n`));
    } else {
      spinner.warn("Job completed but no output URL provided");
    }
  } catch (error) {
    spinner.fail(`Text-to-speech failed: ${error.message}`);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    }
  }
}
