import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import { KitsAIService } from "../kits-service.js";

export async function voiceConvert(inputFile, options) {
  const spinner = ora("Initializing voice conversion...").start();

  try {
    const service = new KitsAIService();

    if (!service.apiKey) {
      spinner.fail('No API key found. Run "kits-cli setup" first.');
      return;
    }

    // Resolve and validate input file path
    const resolvedInputPath = path.resolve(inputFile);

    if (!fs.existsSync(resolvedInputPath)) {
      spinner.fail(`Input file not found: ${resolvedInputPath}`);
      console.log(chalk.gray("Please check the file path and try again."));
      return;
    }

    // Check file size and format
    const stats = fs.statSync(resolvedInputPath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    console.log(chalk.gray(`📁 Input file: ${resolvedInputPath}`));
    console.log(chalk.gray(`📊 File size: ${fileSizeInMB.toFixed(2)}MB`));

    if (fileSizeInMB > 100) {
      spinner.fail(
        `File size (${fileSizeInMB.toFixed(2)}MB) exceeds the 100MB limit`
      );
      return;
    }

    // Check file extension
    const ext = path.extname(resolvedInputPath).toLowerCase();
    const supportedFormats = [".wav", ".mp3", ".flac", ".m4a", ".ogg"];
    if (!supportedFormats.includes(ext)) {
      spinner.fail(`Unsupported file format: ${ext}`);
      console.log(
        chalk.gray(`Supported formats: ${supportedFormats.join(", ")}`)
      );
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
          message: "Choose a voice model:",
          choices: modelsResponse.data.map((model) => ({
            name: `${model.title || model.name} (ID: ${model.id})`,
            value: model.id,
          })),
        },
      ]);

      modelId = selectedModel;
      spinner.start("Starting voice conversion...");
    }

    spinner.text = `Converting voice using model ${modelId}...`;

    const job = await service.voiceConversion(resolvedInputPath, modelId, {
      conversionStrength: options.conversionStrength,
      modelVolumeMix: options.modelVolumeMix,
      pitchShift: options.pitchShift,
    });

    spinner.text = `Job created (ID: ${job.id}). Waiting for completion...`;

    const completedJob = await service.pollJobStatus(
      job.id,
      "voice-conversion",
      (status) => {
        spinner.text = `Job ${status.id}: ${status.status} (${
          status.progress || 0
        }%)`;
      }
    );

    if (completedJob.outputUrl) {
      const outputPath = options.output || `voice_converted_${Date.now()}.wav`;

      spinner.text = "Downloading result...";
      await service.downloadFile(completedJob.outputUrl, outputPath);

      spinner.succeed(
        `Voice conversion completed! Output saved to: ${chalk.cyan(outputPath)}`
      );

      console.log(chalk.gray("\n📄 Job Details:"));
      console.log(chalk.gray(`  Job ID: ${completedJob.id}`));
      console.log(chalk.gray(`  Status: ${completedJob.status}`));
      console.log(chalk.gray(`  Model: ${modelId}`));
      console.log(chalk.gray(`  Input: ${resolvedInputPath}`));
      console.log(chalk.gray(`  Output: ${outputPath}\n`));
    } else {
      spinner.warn("Job completed but no output URL provided");
    }
  } catch (error) {
    spinner.fail(`Voice conversion failed: ${error.message}`);

    // Provide more detailed error information
    if (error.message.includes("timed out")) {
      console.log(chalk.yellow("\n💡 Tips to resolve timeout issues:"));
      console.log(chalk.gray("  • Check your internet connection"));
      console.log(chalk.gray("  • Try with a smaller audio file"));
      console.log(chalk.gray("  • Wait a few minutes and try again"));
      console.log(
        chalk.gray("  • The server might be experiencing high load\n")
      );
    } else if (error.message.includes("file size")) {
      console.log(chalk.yellow("\n💡 File size tips:"));
      console.log(chalk.gray("  • Maximum file size is 100MB"));
      console.log(chalk.gray("  • Try compressing your audio file"));
      console.log(chalk.gray("  • Use a shorter audio clip\n"));
    } else if (error.response) {
      console.error(chalk.red("API Error Details:"), error.response.data);
    }
  }
}
