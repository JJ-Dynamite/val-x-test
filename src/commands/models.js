import chalk from "chalk";
import ora from "ora";
import { KitsAIService } from "../kits-service.js";

export async function listModels(options) {
  const spinner = ora("Fetching voice models...").start();

  try {
    const service = new KitsAIService();

    if (!service.apiKey) {
      spinner.fail('No API key found. Run "kits-cli setup" first.');
      return;
    }

    const response = await service.getVoiceModels(options.page, options.limit);

    spinner.succeed(`Found ${response.data.length} voice models`);

    console.log(chalk.cyan.bold("\n🎤 Available Voice Models:\n"));

    response.data.forEach((model, index) => {
      console.log(
        chalk.white(
          `${index + 1}. ${model.title || model.name || "Unnamed Model"}`
        )
      );
      console.log(chalk.gray(`   ID: ${model.id}`));
      if (model.description) {
        console.log(chalk.gray(`   Description: ${model.description}`));
      }
      if (model.tags && model.tags.length > 0) {
        console.log(chalk.gray(`   Tags: ${model.tags.join(", ")}`));
      }
      if (model.type) {
        console.log(chalk.gray(`   Type: ${model.type}`));
      }
      if (model.demoUrl) {
        console.log(chalk.gray(`   Demo: ${model.demoUrl}`));
      }
      console.log();
    });

    if (response.meta) {
      console.log(chalk.gray(`📊 Pagination:`));
      console.log(
        chalk.gray(
          `   Page: ${response.meta.currentPage} of ${response.meta.lastPage}`
        )
      );
      console.log(chalk.gray(`   Total Models: ${response.meta.total}`));
      console.log(chalk.gray(`   Per Page: ${response.meta.perPage}\n`));

      if (response.meta.currentPage < response.meta.lastPage) {
        console.log(
          chalk.yellow(
            `💡 To see more models, use: kits-cli models list --page ${
              response.meta.currentPage + 1
            }\n`
          )
        );
      }
    }
  } catch (error) {
    spinner.fail(`Failed to fetch voice models: ${error.message}`);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    }
  }
}

export async function getModel(modelId) {
  const spinner = ora(`Fetching model details for ID: ${modelId}...`).start();

  try {
    const service = new KitsAIService();

    if (!service.apiKey) {
      spinner.fail('No API key found. Run "kits-cli setup" first.');
      return;
    }

    const model = await service.getVoiceModel(modelId);

    spinner.succeed("Model details retrieved");

    console.log(chalk.cyan.bold(`\n🎤 Voice Model Details:\n`));

    console.log(chalk.white.bold(`Name: ${model.title || model.name}`));
    console.log(chalk.gray(`ID: ${model.id}`));

    if (model.description) {
      console.log(chalk.gray(`Description: ${model.description}`));
    }

    if (model.type) {
      console.log(chalk.gray(`Type: ${model.type}`));
    }

    if (model.tags && model.tags.length > 0) {
      console.log(chalk.gray(`Tags: ${model.tags.join(", ")}`));
    }

    if (model.language) {
      console.log(chalk.gray(`Language: ${model.language}`));
    }

    if (model.gender) {
      console.log(chalk.gray(`Gender: ${model.gender}`));
    }

    if (model.age) {
      console.log(chalk.gray(`Age: ${model.age}`));
    }

    if (model.accent) {
      console.log(chalk.gray(`Accent: ${model.accent}`));
    }

    if (model.style) {
      console.log(chalk.gray(`Style: ${model.style}`));
    }

    if (model.demoUrl) {
      console.log(chalk.gray(`Demo: ${model.demoUrl}`));
    }

    if (model.imageUrl) {
      console.log(chalk.gray(`Image: ${model.imageUrl}`));
    }

    if (model.isUsable !== undefined) {
      console.log(chalk.gray(`Available: ${model.isUsable ? "Yes" : "No"}`));
    }

    if (model.createdAt) {
      console.log(
        chalk.gray(`Created: ${new Date(model.createdAt).toLocaleDateString()}`)
      );
    }

    if (model.updatedAt) {
      console.log(
        chalk.gray(`Updated: ${new Date(model.updatedAt).toLocaleDateString()}`)
      );
    }

    console.log(chalk.cyan("\n💡 Usage Examples:"));
    console.log(
      chalk.white(
        `  Voice Conversion: kits-cli voice-convert input.wav --model-id ${modelId}`
      )
    );
    console.log(
      chalk.white(
        `  Text-to-Speech: kits-cli tts "Hello world" --model-id ${modelId}`
      )
    );
    console.log(
      chalk.white(
        `  Voice Blending: kits-cli voice-blend input.wav --models ${modelId},OTHER_ID --weights 0.5,0.5\n`
      )
    );
  } catch (error) {
    spinner.fail(`Failed to fetch model details: ${error.message}`);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    }
  }
}
