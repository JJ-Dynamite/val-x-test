#!/usr/bin/env node

/**
 * Basic Usage Examples for Kits AI CLI
 *
 * This script shows simple examples of how to use each feature
 * of the Kits AI CLI programmatically.
 */

import { KitsAIService } from "../src/kits-service.js";
import chalk from "chalk";
import path from "path";

async function basicUsageExamples() {
  console.log(chalk.cyan.bold("\n🎵 Kits AI CLI - Basic Usage Examples\n"));

  // Initialize service
  const service = new KitsAIService();

  if (!service.apiKey) {
    console.log(chalk.red("❌ No API key found."));
    console.log(chalk.yellow("Please run: node index.js setup\n"));
    return;
  }

  try {
    // Example 1: List Voice Models
    console.log(chalk.yellow.bold("1. 📋 Listing Voice Models"));
    console.log(chalk.gray("Getting first 3 available voice models...\n"));

    const models = await service.getVoiceModels(1, 3);

    if (models.data && models.data.length > 0) {
      console.log(chalk.green(`✅ Found ${models.data.length} models:`));
      models.data.forEach((model, index) => {
        console.log(
          chalk.white(`  ${index + 1}. ${model.name} (ID: ${model.id})`)
        );
      });

      // Store first model for later examples
      const exampleModel = models.data[0];
      console.log(
        chalk.cyan(
          `\n💡 We'll use "${exampleModel.name}" for the examples below.\n`
        )
      );

      // Example 2: Get Model Details
      console.log(chalk.yellow.bold("2. 🎤 Getting Model Details"));
      const modelDetails = await service.getVoiceModel(exampleModel.id);
      console.log(chalk.green("✅ Model details retrieved:"));
      console.log(chalk.white(`  Name: ${modelDetails.name}`));
      console.log(chalk.white(`  ID: ${modelDetails.id}`));
      console.log(chalk.white(`  Type: ${modelDetails.type || "N/A"}`));
      console.log(
        chalk.white(`  Description: ${modelDetails.description || "N/A"}\n`)
      );

      // Example 3: Text-to-Speech (simulation)
      console.log(chalk.yellow.bold("3. 🎙️  Text-to-Speech Example"));
      console.log(chalk.gray("This would convert text to speech..."));

      const exampleText =
        "Hello! This is an example of text-to-speech conversion.";
      console.log(chalk.cyan(`Text: "${exampleText}"`));
      console.log(chalk.cyan(`Model: ${exampleModel.name}`));
      console.log(
        chalk.yellow(
          '💡 Command: node index.js tts "' +
            exampleText +
            '" --model-id ' +
            exampleModel.id
        )
      );
      console.log(chalk.green("✅ Would create TTS job and download result\n"));

      // Example 4: Voice Conversion (simulation)
      console.log(chalk.yellow.bold("4. 🔄 Voice Conversion Example"));
      console.log(
        chalk.gray("This would convert existing audio to a different voice...")
      );

      console.log(chalk.cyan("Input: your_audio.wav"));
      console.log(chalk.cyan(`Target Voice: ${exampleModel.name}`));
      console.log(chalk.cyan("Output: converted_audio.wav"));
      console.log(
        chalk.yellow(
          "💡 Command: node index.js voice-convert your_audio.wav --model-id " +
            exampleModel.id
        )
      );
      console.log(
        chalk.green(
          "✅ Would upload audio, convert voice, and download result\n"
        )
      );
    } else {
      console.log(chalk.red("❌ No voice models available"));
      return;
    }

    // Example 5: Vocal Separation (simulation)
    console.log(chalk.yellow.bold("5. 🎤 Vocal Separation Example"));
    console.log(
      chalk.gray("This would separate vocals from instrumental tracks...")
    );

    console.log(chalk.cyan("Input: full_song.wav"));
    console.log(chalk.cyan("Outputs: vocals.wav + instrumentals.wav"));
    console.log(
      chalk.yellow(
        "💡 Command: node index.js vocal-separate full_song.wav --output-dir separated/"
      )
    );
    console.log(
      chalk.green(
        "✅ Would upload song, separate tracks, and download both files\n"
      )
    );

    // Example 6: Stem Splitting (simulation)
    console.log(chalk.yellow.bold("6. 🥁 Stem Splitting Example"));
    console.log(
      chalk.gray("This would split audio into individual instrument stems...")
    );

    console.log(chalk.cyan("Input: full_song.wav"));
    console.log(
      chalk.cyan("Outputs: drums.wav, bass.wav, vocals.wav, other.wav")
    );
    console.log(
      chalk.yellow(
        "💡 Command: node index.js stem-split full_song.wav --output-dir stems/"
      )
    );
    console.log(
      chalk.green(
        "✅ Would upload song, split into stems, and download all files\n"
      )
    );

    // Example 7: Voice Blending (simulation)
    if (models.data.length >= 2) {
      console.log(chalk.yellow.bold("7. 🎭 Voice Blending Example"));
      console.log(chalk.gray("This would blend multiple voices together..."));

      const model1 = models.data[0];
      const model2 = models.data[1];

      console.log(chalk.cyan("Input: your_audio.wav"));
      console.log(chalk.cyan(`Voice 1: ${model1.name} (60%)`));
      console.log(chalk.cyan(`Voice 2: ${model2.name} (40%)`));
      console.log(chalk.cyan("Output: blended_voice.wav"));
      console.log(
        chalk.yellow(
          `💡 Command: node index.js voice-blend your_audio.wav --models "${model1.id},${model2.id}" --weights "0.6,0.4"`
        )
      );
      console.log(
        chalk.green(
          "✅ Would upload audio, blend voices, and download result\n"
        )
      );
    }

    // Example 8: Interactive Mode
    console.log(chalk.yellow.bold("8. 🎯 Interactive Mode"));
    console.log(
      chalk.gray("For the easiest experience, use interactive mode:")
    );
    console.log(chalk.cyan("💡 Command: node index.js interactive"));
    console.log(chalk.green("✅ Provides guided menu for all features\n"));

    // Summary
    console.log(chalk.cyan.bold("📋 Quick Command Summary:\n"));

    const commands = [
      { cmd: "node index.js setup", desc: "Configure API key" },
      {
        cmd: "node index.js interactive",
        desc: "Interactive mode (recommended)",
      },
      { cmd: "node index.js models list", desc: "List voice models" },
      { cmd: "node index.js voice-convert input.wav", desc: "Convert voice" },
      { cmd: 'node index.js tts "Hello world"', desc: "Text-to-speech" },
      { cmd: "node index.js vocal-separate song.wav", desc: "Separate vocals" },
      { cmd: "node index.js stem-split song.wav", desc: "Split into stems" },
      { cmd: "node index.js voice-blend input.wav", desc: "Blend voices" },
      { cmd: "node index.js status job_12345", desc: "Check job status" },
    ];

    commands.forEach(({ cmd, desc }) => {
      console.log(chalk.white(`${cmd.padEnd(40)} # ${desc}`));
    });

    console.log(
      chalk.green.bold("\n🎉 Ready to start creating amazing audio content!\n")
    );
    console.log(
      chalk.cyan(
        '💡 Tip: Start with "node index.js interactive" for the best experience.\n'
      )
    );
  } catch (error) {
    console.error(chalk.red("Error:"), error.message);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    } else {
      console.log(chalk.yellow("\n💡 Make sure you have:"));
      console.log(chalk.gray("  1. Valid API key configured"));
      console.log(chalk.gray("  2. Internet connection"));
      console.log(chalk.gray("  3. Sufficient API quota\n"));
    }
  }
}

// Run the examples
basicUsageExamples().catch(console.error);
