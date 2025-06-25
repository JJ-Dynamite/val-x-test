#!/usr/bin/env node

/**
 * Kits AI CLI - Quick Start Guide
 *
 * This script helps new users get started with the Kits AI CLI
 * by providing step-by-step setup and first usage.
 */

import chalk from "chalk";
import inquirer from "inquirer";
import { config } from "./src/config.js";
import { KitsAIService } from "./src/kits-service.js";

async function quickStart() {
  console.log(chalk.cyan.bold("\n🎵 Welcome to Kits AI CLI! 🎵\n"));
  console.log(
    chalk.gray(
      "Let's get you started with voice conversion, TTS, vocal separation, and more!\n"
    )
  );

  // Step 1: Check if API key exists
  const existingApiKey = config.getApiKey();

  if (!existingApiKey) {
    console.log(chalk.yellow("📋 Step 1: API Key Setup"));
    console.log(chalk.gray("You need a Kits AI API key to use this CLI."));
    console.log(
      chalk.cyan("Get yours from: https://docs.kits.ai/api-reference\n")
    );

    const { hasApiKey } = await inquirer.prompt([
      {
        type: "confirm",
        name: "hasApiKey",
        message: "Do you have a Kits AI API key?",
        default: false,
      },
    ]);

    if (!hasApiKey) {
      console.log(chalk.yellow("\n📍 To get your API key:"));
      console.log(
        chalk.white("  1. Visit: https://docs.kits.ai/api-reference")
      );
      console.log(chalk.white("  2. Sign up or log in to your account"));
      console.log(chalk.white("  3. Navigate to the API Access page"));
      console.log(chalk.white("  4. Generate a new API token"));
      console.log(
        chalk.white("  5. Copy the token and run this script again\n")
      );
      console.log(chalk.cyan("💡 Then run: node quick-start.js\n"));
      return;
    }

    // Setup API key
    const { setupApiKey } = await import("./src/commands/setup.js");
    await setupApiKey();
  } else {
    console.log(chalk.green("✅ API key already configured!"));
  }

  // Step 2: Test API connection
  console.log(chalk.yellow("\n📋 Step 2: Testing API Connection"));

  try {
    const service = new KitsAIService();
    console.log(chalk.gray("Connecting to Kits AI API..."));

    const models = await service.getVoiceModels(1, 3);

    if (models.data && models.data.length > 0) {
      console.log(
        chalk.green(
          `✅ Connected! Found ${models.data.length} voice models available.`
        )
      );
    } else {
      console.log(chalk.yellow("⚠️  Connected but no voice models found."));
    }
  } catch (error) {
    console.log(chalk.red("❌ Connection failed:"), error.message);
    console.log(chalk.yellow("Please check your API key and try again.\n"));
    return;
  }

  // Step 3: Quick demo
  console.log(chalk.yellow("\n📋 Step 3: What would you like to try first?"));

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose your first action:",
      choices: [
        {
          name: "🎯 Interactive Mode - Guided experience (Recommended)",
          value: "interactive",
        },
        {
          name: "🎤 Browse Voice Models - See what voices are available",
          value: "models",
        },
        {
          name: "📚 View Examples - See example commands",
          value: "examples",
        },
        {
          name: "📖 Read Documentation - View help and commands",
          value: "help",
        },
        {
          name: "❌ Exit - I'll explore later",
          value: "exit",
        },
      ],
    },
  ]);

  console.log();

  switch (action) {
    case "interactive":
      console.log(chalk.cyan("🎯 Launching Interactive Mode..."));
      console.log(
        chalk.gray(
          "This will give you a guided menu to explore all features.\n"
        )
      );

      const { interactiveMode } = await import("./src/commands/interactive.js");
      await interactiveMode();
      break;

    case "models":
      console.log(chalk.cyan("🎤 Browsing Voice Models..."));
      console.log(chalk.gray("Here are the available voice models:\n"));

      const { listModels } = await import("./src/commands/models.js");
      await listModels({ page: 1, limit: 10 });
      break;

    case "examples":
      console.log(chalk.cyan("📚 Running Examples..."));
      console.log(chalk.gray("Here are some example commands you can try:\n"));

      // Import and run basic examples
      const { exec } = await import("child_process");
      exec("node examples/basic-usage.js", (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red("Error running examples:"), error.message);
        } else {
          console.log(stdout);
        }
      });
      break;

    case "help":
      console.log(chalk.cyan("📖 CLI Help & Documentation"));
      console.log(chalk.gray("Here are the available commands:\n"));

      const { exec: execHelp } = await import("child_process");
      execHelp("node index.js --help", (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red("Error showing help:"), error.message);
        } else {
          console.log(stdout);
        }
      });
      break;

    case "exit":
      console.log(chalk.cyan("👋 Thanks for trying Kits AI CLI!"));
      console.log(
        chalk.gray(
          "When you're ready to start, run: node index.js interactive\n"
        )
      );
      return;
  }

  // Final tips
  console.log(
    chalk.cyan.bold("\n🎉 You're all set! Here are some helpful commands:\n")
  );

  const tips = [
    { cmd: "node index.js interactive", desc: "Interactive mode (easiest)" },
    { cmd: "node index.js models list", desc: "Browse voice models" },
    { cmd: 'node index.js tts "Hello world"', desc: "Text-to-speech" },
    { cmd: "node index.js voice-convert audio.wav", desc: "Voice conversion" },
    { cmd: "node index.js vocal-separate song.wav", desc: "Vocal separation" },
    { cmd: "node index.js --help", desc: "Show all commands" },
  ];

  tips.forEach(({ cmd, desc }) => {
    console.log(chalk.white(`${cmd.padEnd(35)} # ${desc}`));
  });

  console.log(
    chalk.yellow(
      "\n💡 Pro tip: All commands have interactive prompts if you don't specify options!"
    )
  );
  console.log(
    chalk.gray(
      'Example: "node index.js voice-convert audio.wav" will let you choose a voice model.\n'
    )
  );

  console.log(chalk.green("Happy creating! 🎵\n"));
}

// Run quick start
quickStart().catch((error) => {
  console.error(chalk.red("Quick start failed:"), error.message);
  process.exit(1);
});
