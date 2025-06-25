import chalk from "chalk";
import inquirer from "inquirer";
import { KitsAIService } from "../kits-service.js";

export async function interactiveMode() {
  console.log(chalk.cyan.bold("\n🎯 Interactive Kits AI CLI\n"));
  console.log(chalk.gray("Explore all the amazing features of Kits AI!\n"));

  const service = new KitsAIService();

  if (!service.apiKey) {
    console.log(chalk.red("❌ No API key found."));
    const { setupNow } = await inquirer.prompt([
      {
        type: "confirm",
        name: "setupNow",
        message: "Would you like to set up your API key now?",
        default: true,
      },
    ]);

    if (setupNow) {
      const { setupApiKey } = await import("./setup.js");
      await setupApiKey();
    } else {
      console.log(
        chalk.yellow(
          'Please run "kits-cli setup" to configure your API key first.\n'
        )
      );
      return;
    }
  }

  while (true) {
    console.log(chalk.cyan.bold("🎵 What would you like to do?\n"));

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Choose an action:",
        choices: [
          {
            name: "🔄 Voice Conversion - Convert audio to different voices",
            value: "voice-convert",
          },
          {
            name: "🎙️  Text-to-Speech - Convert text to speech",
            value: "tts",
          },
          {
            name: "🎤 Vocal Separation - Separate vocals from instrumentals",
            value: "vocal-separate",
          },
          {
            name: "🥁 Stem Splitting - Split audio into different stems",
            value: "stem-split",
          },
          {
            name: "🎭 Voice Blending - Blend multiple voices together",
            value: "voice-blend",
          },
          {
            name: "📋 Voice Models - Browse available voice models",
            value: "models",
          },
          {
            name: "📊 Check Job Status - Monitor your processing jobs",
            value: "status",
          },
          {
            name: "🔧 Configuration - Manage API settings",
            value: "config",
          },
          {
            name: "❌ Exit",
            value: "exit",
          },
        ],
      },
    ]);

    if (action === "exit") {
      console.log(
        chalk.cyan("\n👋 Thanks for using Kits AI CLI! Happy creating!\n")
      );
      break;
    }

    await handleInteractiveAction(action);

    // Ask if user wants to continue
    const { continueUsing } = await inquirer.prompt([
      {
        type: "confirm",
        name: "continueUsing",
        message: "Would you like to perform another action?",
        default: true,
      },
    ]);

    if (!continueUsing) {
      console.log(
        chalk.cyan("\n👋 Thanks for using Kits AI CLI! Happy creating!\n")
      );
      break;
    }

    console.log("\n" + "─".repeat(50) + "\n");
  }
}

async function handleInteractiveAction(action) {
  try {
    switch (action) {
      case "voice-convert":
        await handleVoiceConvert();
        break;
      case "tts":
        await handleTextToSpeech();
        break;
      case "vocal-separate":
        await handleVocalSeparate();
        break;
      case "stem-split":
        await handleStemSplit();
        break;
      case "voice-blend":
        await handleVoiceBlend();
        break;
      case "models":
        await handleModels();
        break;
      case "status":
        await handleStatus();
        break;
      case "config":
        await handleConfig();
        break;
    }
  } catch (error) {
    console.error(chalk.red("Error:"), error.message);
  }
}

async function handleVoiceConvert() {
  const { inputFile } = await inquirer.prompt([
    {
      type: "input",
      name: "inputFile",
      message: "Enter the path to your audio file:",
      validate: (input) =>
        input.trim().length > 0 ? true : "Please enter a valid file path",
    },
  ]);

  const { voiceConvert } = await import("./voice-convert.js");
  await voiceConvert(inputFile, {});
}

async function handleTextToSpeech() {
  const { text } = await inquirer.prompt([
    {
      type: "input",
      name: "text",
      message: "Enter the text to convert to speech:",
      validate: (input) =>
        input.trim().length > 0 ? true : "Please enter some text",
    },
  ]);

  const { textToSpeech } = await import("./tts.js");
  await textToSpeech(text, {});
}

async function handleVocalSeparate() {
  const { inputFile } = await inquirer.prompt([
    {
      type: "input",
      name: "inputFile",
      message: "Enter the path to your audio file:",
      validate: (input) =>
        input.trim().length > 0 ? true : "Please enter a valid file path",
    },
  ]);

  const { vocalSeparate } = await import("./vocal-separate.js");
  await vocalSeparate(inputFile, {});
}

async function handleStemSplit() {
  const { inputFile } = await inquirer.prompt([
    {
      type: "input",
      name: "inputFile",
      message: "Enter the path to your audio file:",
      validate: (input) =>
        input.trim().length > 0 ? true : "Please enter a valid file path",
    },
  ]);

  const { stemSplit } = await import("./stem-split.js");
  await stemSplit(inputFile, {});
}

async function handleVoiceBlend() {
  const { inputFile } = await inquirer.prompt([
    {
      type: "input",
      name: "inputFile",
      message: "Enter the path to your audio file:",
      validate: (input) =>
        input.trim().length > 0 ? true : "Please enter a valid file path",
    },
  ]);

  const { voiceBlend } = await import("./voice-blend.js");
  await voiceBlend(inputFile, {});
}

async function handleModels() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Voice Models:",
      choices: [
        { name: "List all models", value: "list" },
        { name: "Get specific model details", value: "get" },
      ],
    },
  ]);

  const { listModels, getModel } = await import("./models.js");

  if (action === "list") {
    await listModels({ page: 1, limit: 20 });
  } else {
    const { modelId } = await inquirer.prompt([
      {
        type: "input",
        name: "modelId",
        message: "Enter model ID:",
        validate: (input) =>
          input.trim().length > 0 ? true : "Please enter a valid model ID",
      },
    ]);
    await getModel(modelId);
  }
}

async function handleStatus() {
  const { jobId } = await inquirer.prompt([
    {
      type: "input",
      name: "jobId",
      message: "Enter job ID to check:",
      validate: (input) =>
        input.trim().length > 0 ? true : "Please enter a valid job ID",
    },
  ]);

  const { checkStatus } = await import("./status.js");
  await checkStatus(jobId);
}

async function handleConfig() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Configuration:",
      choices: [
        { name: "Update API key", value: "update-key" },
        { name: "Remove API key", value: "remove-key" },
        { name: "Show current config", value: "show-config" },
      ],
    },
  ]);

  const { config } = await import("../config.js");

  if (action === "update-key") {
    const { setupApiKey } = await import("./setup.js");
    await setupApiKey();
  } else if (action === "remove-key") {
    const success = config.removeApiKey();
    if (success) {
      console.log(chalk.green("✅ API key removed successfully"));
    } else {
      console.log(chalk.red("❌ Failed to remove API key"));
    }
  } else {
    const currentConfig = config.getConfig();
    console.log(chalk.cyan("\n📋 Current Configuration:"));
    console.log(
      chalk.gray(
        `API Key: ${
          currentConfig.apiKey
            ? "***" + currentConfig.apiKey.slice(-4)
            : "Not set"
        }`
      )
    );
  }
}
