import inquirer from "inquirer";
import chalk from "chalk";
import { config } from "../config.js";

export async function setupApiKey() {
  console.log(chalk.cyan.bold("\n🔧 Setup Kits AI CLI\n"));

  console.log(chalk.gray("You need a Kits AI API key to use this CLI."));
  console.log(
    chalk.gray("Get your API key from: https://docs.kits.ai/api-reference\n")
  );

  const answers = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Enter your Kits AI API key:",
      validate: (input) => {
        if (!input || input.trim().length === 0) {
          return "API key is required";
        }
        return true;
      },
    },
    {
      type: "confirm",
      name: "save",
      message: "Save API key to local config file?",
      default: true,
    },
  ]);

  if (answers.save) {
    const success = config.setApiKey(answers.apiKey.trim());
    if (success) {
      console.log(chalk.green("\n✅ API key saved successfully!"));
      console.log(chalk.gray("You can now use all Kits AI CLI features.\n"));
    } else {
      console.log(chalk.red("\n❌ Failed to save API key to config file."));
      console.log(
        chalk.yellow(
          "You can set it as an environment variable: KITS_API_KEY\n"
        )
      );
    }
  } else {
    console.log(chalk.yellow("\n⚠️  API key not saved."));
    console.log(
      chalk.gray("Set the KITS_API_KEY environment variable to use the CLI.\n")
    );
  }

  console.log(chalk.cyan("🎉 Setup complete! Try running:"));
  console.log(chalk.white("  kits-cli models list"));
  console.log(chalk.white("  kits-cli interactive\n"));
}
