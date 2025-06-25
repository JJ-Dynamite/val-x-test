#!/usr/bin/env node

import CLI from "cli-kit";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { KitsAIService } from "./src/kits-service.js";
import { config } from "./src/config.js";

const cli = new CLI({
  name: "kits-cli",
  version: "1.0.0",
  desc: "Comprehensive CLI tool for Kits AI - Voice conversion, TTS, vocal separation, and more!",

  commands: {
    setup: {
      desc: "Setup API key for Kits AI",
      action: async () => {
        const { setupApiKey } = await import("./src/commands/setup.js");
        await setupApiKey();
      },
    },

    "voice-convert": {
      desc: "Convert audio file to different voice model",
      args: [
        {
          name: "input",
          desc: "Input audio file path",
          required: true,
        },
      ],
      options: {
        "--model-id [value]": {
          desc: "Voice model ID to use for conversion",
          type: "string",
        },
        "--output [path]": {
          desc: "Output file path",
          type: "string",
        },
      },
      action: async ({ argv, _ }) => {
        const { voiceConvert } = await import(
          "./src/commands/voice-convert.js"
        );
        await voiceConvert(_[0], argv);
      },
    },

    tts: {
      desc: "Convert text to speech using voice models",
      args: [
        {
          name: "text",
          desc: "Text to convert to speech",
          required: true,
        },
      ],
      options: {
        "--model-id [value]": {
          desc: "Voice model ID to use for TTS",
          type: "string",
        },
        "--output [path]": {
          desc: "Output audio file path",
          type: "string",
        },
      },
      action: async ({ argv, _ }) => {
        const { textToSpeech } = await import("./src/commands/tts.js");
        await textToSpeech(_[0], argv);
      },
    },

    "vocal-separate": {
      desc: "Separate vocals from instrumental tracks",
      args: [
        {
          name: "input",
          desc: "Input audio file path",
          required: true,
        },
      ],
      options: {
        "--output-dir [path]": {
          desc: "Output directory for separated files",
          type: "string",
        },
      },
      action: async ({ argv, _ }) => {
        const { vocalSeparate } = await import(
          "./src/commands/vocal-separate.js"
        );
        await vocalSeparate(_[0], argv);
      },
    },

    "stem-split": {
      desc: "Split audio into different stems (drums, bass, etc.)",
      args: [
        {
          name: "input",
          desc: "Input audio file path",
          required: true,
        },
      ],
      options: {
        "--output-dir [path]": {
          desc: "Output directory for stem files",
          type: "string",
        },
      },
      action: async ({ argv, _ }) => {
        const { stemSplit } = await import("./src/commands/stem-split.js");
        await stemSplit(_[0], argv);
      },
    },

    "voice-blend": {
      desc: "Blend multiple voices together",
      args: [
        {
          name: "input",
          desc: "Input audio file path",
          required: true,
        },
      ],
      options: {
        "--models [ids]": {
          desc: "Comma-separated voice model IDs to blend",
          type: "string",
        },
        "--weights [values]": {
          desc: "Comma-separated blend weights (0-1)",
          type: "string",
        },
        "--output [path]": {
          desc: "Output file path",
          type: "string",
        },
      },
      action: async ({ argv, _ }) => {
        const { voiceBlend } = await import("./src/commands/voice-blend.js");
        await voiceBlend(_[0], argv);
      },
    },

    models: {
      desc: "List and manage voice models",
      commands: {
        list: {
          desc: "List available voice models",
          options: {
            "--page [number]": {
              desc: "Page number for pagination",
              type: "int",
              default: 1,
            },
            "--limit [number]": {
              desc: "Number of models per page",
              type: "int",
              default: 20,
            },
          },
          action: async ({ argv }) => {
            const { listModels } = await import("./src/commands/models.js");
            await listModels(argv);
          },
        },
        get: {
          desc: "Get details of a specific voice model",
          args: [
            {
              name: "modelId",
              desc: "Voice model ID",
              required: true,
            },
          ],
          action: async ({ _ }) => {
            const { getModel } = await import("./src/commands/models.js");
            await getModel(_[0]);
          },
        },
      },
    },

    status: {
      desc: "Check job status",
      args: [
        {
          name: "jobId",
          desc: "Job ID to check status",
          required: true,
        },
      ],
      action: async ({ _ }) => {
        const { checkStatus } = await import("./src/commands/status.js");
        await checkStatus(_[0]);
      },
    },

    interactive: {
      desc: "Interactive mode to explore all features",
      action: async () => {
        const { interactiveMode } = await import(
          "./src/commands/interactive.js"
        );
        await interactiveMode();
      },
    },

    help: {
      desc: "Show comprehensive help and usage guide",
      action: async () => {
        const { showHelp } = await import("./src/commands/help.js");
        showHelp();
      },
    },
  },

  options: {
    "--api-key [key]": {
      desc: "Kits AI API key (can also be set via KITS_API_KEY env var)",
      type: "string",
    },
    "--verbose": {
      desc: "Enable verbose logging",
    },
  },
});

// Check if no command was provided
const args = process.argv.slice(2);
const hasCommand = args.length > 0 && !args[0].startsWith("-");

// Display welcome message
console.log(chalk.cyan.bold("\n🎵 Welcome to Kits AI CLI! 🎵\n"));
console.log(
  chalk.gray(
    "A comprehensive tool for voice conversion, TTS, vocal separation, and more!\n"
  )
);

// Check if API key is configured
const apiKey = process.env.KITS_API_KEY || config.getApiKey();
if (!apiKey) {
  console.log(
    chalk.yellow("⚠️  No API key found. Run"),
    chalk.cyan("kits-cli setup"),
    chalk.yellow("to configure your API key.\n")
  );
}

// If no command provided, show help
if (!hasCommand) {
  console.log(chalk.white.bold("Available Commands:\n"));

  console.log(
    chalk.cyan("  setup                    ") +
      chalk.gray("Configure your Kits AI API key")
  );
  console.log(
    chalk.cyan("  voice-convert <input>    ") +
      chalk.gray("Convert audio to different voice")
  );
  console.log(
    chalk.cyan("  tts <text>               ") +
      chalk.gray("Convert text to speech")
  );
  console.log(
    chalk.cyan("  vocal-separate <input>   ") +
      chalk.gray("Separate vocals from instrumentals")
  );
  console.log(
    chalk.cyan("  stem-split <input>       ") +
      chalk.gray("Split audio into stems")
  );
  console.log(
    chalk.cyan("  voice-blend <input>      ") +
      chalk.gray("Blend multiple voices")
  );
  console.log(
    chalk.cyan("  models list              ") +
      chalk.gray("List available voice models")
  );
  console.log(
    chalk.cyan("  models get <modelId>     ") +
      chalk.gray("Get voice model details")
  );
  console.log(
    chalk.cyan("  status <jobId>           ") + chalk.gray("Check job status")
  );
  console.log(
    chalk.cyan("  interactive              ") +
      chalk.gray("Launch interactive mode")
  );
  console.log(
    chalk.cyan("  help                     ") +
      chalk.gray("Show detailed help guide")
  );

  console.log(chalk.white.bold("\nQuick Start:\n"));
  console.log(
    chalk.gray("  • Run"),
    chalk.cyan("kits-cli help"),
    chalk.gray("for detailed usage guide")
  );
  console.log(
    chalk.gray("  • Run"),
    chalk.cyan("kits-cli interactive"),
    chalk.gray("for guided experience")
  );
  console.log(
    chalk.gray("  • Run"),
    chalk.cyan("kits-cli models list"),
    chalk.gray("to browse voice models")
  );

  if (!apiKey) {
    console.log(
      chalk.gray("  • Run"),
      chalk.cyan("kits-cli setup"),
      chalk.gray("to configure API key first")
    );
  }

  console.log("");
  process.exit(0);
}

// Run the CLI
cli.exec().catch((error) => {
  console.error(chalk.red("Error:"), error.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(error.stack);
  }
  process.exit(1);
});
