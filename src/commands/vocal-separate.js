import chalk from "chalk";
import ora from "ora";
import path from "path";
import { KitsAIService } from "../kits-service.js";

export async function vocalSeparate(inputFile, options) {
  const spinner = ora("Initializing vocal separation...").start();

  try {
    const service = new KitsAIService();

    if (!service.apiKey) {
      spinner.fail('No API key found. Run "kits-cli setup" first.');
      return;
    }

    spinner.text = "Starting vocal separation...";

    const job = await service.vocalSeparation(inputFile);

    spinner.text = `Job created (ID: ${job.id}). Waiting for completion...`;

    const completedJob = await service.pollJobStatus(
      job.id,
      "vocal-separation",
      (status) => {
        spinner.text = `Job ${status.id}: ${status.status} (${
          status.progress || 0
        }%)`;
      }
    );

    if (completedJob.outputUrls) {
      const outputDir = options.outputDir || `vocal_separation_${Date.now()}`;

      // Ensure output directory exists
      const fs = await import("fs-extra");
      await fs.ensureDir(outputDir);

      spinner.text = "Downloading separated tracks...";

      const downloads = [];
      for (const [trackType, url] of Object.entries(completedJob.outputUrls)) {
        const outputPath = path.join(outputDir, `${trackType}.wav`);
        downloads.push(service.downloadFile(url, outputPath));
      }

      await Promise.all(downloads);

      spinner.succeed(
        `Vocal separation completed! Files saved to: ${chalk.cyan(outputDir)}`
      );

      console.log(chalk.gray("\n📄 Job Details:"));
      console.log(chalk.gray(`  Job ID: ${completedJob.id}`));
      console.log(chalk.gray(`  Status: ${completedJob.status}`));
      console.log(chalk.gray(`  Input: ${inputFile}`));
      console.log(chalk.gray(`  Output Directory: ${outputDir}`));
      console.log(chalk.gray(`  Separated Tracks:`));

      for (const trackType of Object.keys(completedJob.outputUrls)) {
        console.log(chalk.gray(`    - ${trackType}.wav`));
      }
      console.log();
    } else {
      spinner.warn("Job completed but no output URLs provided");
    }
  } catch (error) {
    spinner.fail(`Vocal separation failed: ${error.message}`);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    }
  }
}
