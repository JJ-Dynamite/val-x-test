import chalk from "chalk";
import ora from "ora";
import { KitsAIService } from "../kits-service.js";

export async function checkStatus(jobId) {
  const spinner = ora(`Checking status for job: ${jobId}...`).start();

  try {
    const service = new KitsAIService();

    if (!service.apiKey) {
      spinner.fail('No API key found. Run "kits-cli setup" first.');
      return;
    }

    // Try different job types to find the correct one
    const jobTypes = [
      "voice-conversion",
      "text-to-speech",
      "vocal-separation",
      "stem-splitter",
      "voice-blender",
    ];

    let job = null;
    let jobType = null;

    for (const type of jobTypes) {
      try {
        const getJobMethod = service.getJobMethod(type);
        job = await getJobMethod(jobId);
        jobType = type;
        break;
      } catch (error) {
        // Continue to next job type if not found
        if (error.response && error.response.status === 404) {
          continue;
        }
        throw error;
      }
    }

    if (!job) {
      spinner.fail(`Job not found: ${jobId}`);
      return;
    }

    spinner.succeed("Job status retrieved");

    console.log(chalk.cyan.bold("\n📋 Job Status:\n"));

    console.log(chalk.white.bold(`Job ID: ${job.id}`));
    console.log(chalk.gray(`Type: ${jobType}`));

    // Status with color coding
    let statusColor = chalk.gray;
    switch (job.status) {
      case "completed":
        statusColor = chalk.green;
        break;
      case "failed":
        statusColor = chalk.red;
        break;
      case "processing":
      case "running":
        statusColor = chalk.yellow;
        break;
      case "queued":
      case "pending":
        statusColor = chalk.blue;
        break;
    }

    console.log(`Status: ${statusColor(job.status)}`);

    if (job.progress !== undefined) {
      console.log(chalk.gray(`Progress: ${job.progress}%`));
    }

    if (job.createdAt) {
      console.log(
        chalk.gray(`Created: ${new Date(job.createdAt).toLocaleString()}`)
      );
    }

    if (job.updatedAt) {
      console.log(
        chalk.gray(`Updated: ${new Date(job.updatedAt).toLocaleString()}`)
      );
    }

    if (job.error) {
      console.log(chalk.red(`Error: ${job.error}`));
    }

    // Show output information if available
    if (job.status === "completed") {
      console.log(chalk.cyan("\n🎯 Output Information:"));

      if (job.outputUrl) {
        console.log(chalk.gray(`Output URL: ${job.outputUrl}`));
        console.log(
          chalk.yellow(
            `💡 Download with: curl "${job.outputUrl}" -o output.wav`
          )
        );
      }

      if (job.outputUrls) {
        console.log(chalk.gray("Output URLs:"));
        Object.entries(job.outputUrls).forEach(([type, url]) => {
          console.log(chalk.gray(`  ${type}: ${url}`));
        });
      }
    }

    // Show estimated completion time if processing
    if (job.status === "processing" || job.status === "running") {
      console.log(chalk.yellow("\n⏳ Job is still processing..."));
      console.log(
        chalk.gray("Check again in a few moments or use the polling command:")
      );
      console.log(chalk.white(`kits-cli status ${jobId}`));
    }

    console.log();
  } catch (error) {
    spinner.fail(`Failed to check job status: ${error.message}`);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    }
  }
}
