#!/usr/bin/env node

/**
 * Kits AI CLI Demo Script
 *
 * This script demonstrates all the available features of the Kits AI CLI
 * and provides examples of how to use each feature programmatically.
 */

import { KitsAIService } from "../src/kits-service.js";
import chalk from "chalk";

async function demoAllFeatures() {
  console.log(chalk.cyan.bold("\n🎵 Kits AI CLI - Complete Feature Demo\n"));

  // Initialize service
  const service = new KitsAIService();

  if (!service.apiKey) {
    console.log(
      chalk.red('❌ No API key found. Please run "kits-cli setup" first.')
    );
    return;
  }

  try {
    // 1. List Voice Models
    console.log(chalk.yellow.bold("📋 1. Voice Models API"));
    console.log(chalk.gray("Fetching available voice models...\n"));

    const models = await service.getVoiceModels(1, 5);
    console.log(chalk.green(`✅ Found ${models.data.length} voice models`));

    models.data.forEach((model, index) => {
      console.log(
        chalk.white(`  ${index + 1}. ${model.name} (ID: ${model.id})`)
      );
    });

    if (models.data.length > 0) {
      const firstModel = models.data[0];
      console.log(
        chalk.cyan(`\n🎤 Getting details for model: ${firstModel.name}`)
      );

      const modelDetails = await service.getVoiceModel(firstModel.id);
      console.log(
        chalk.gray(`   Description: ${modelDetails.description || "N/A"}`)
      );
      console.log(chalk.gray(`   Type: ${modelDetails.type || "N/A"}`));
    }

    console.log("\n" + "─".repeat(60) + "\n");

    // 2. Text-to-Speech Demo
    console.log(chalk.yellow.bold("🎙️  2. Text-to-Speech API"));
    console.log(chalk.gray("Converting text to speech...\n"));

    if (models.data.length > 0) {
      const demoText =
        "Hello! This is a demonstration of the Kits AI text-to-speech feature.";
      console.log(chalk.cyan(`Text: "${demoText}"`));
      console.log(
        chalk.cyan(`Model: ${models.data[0].name} (${models.data[0].id})`)
      );

      // Note: In a real demo, you would actually process this
      console.log(
        chalk.yellow("💡 This would create a TTS job and process the audio")
      );
      console.log(chalk.green("✅ TTS job would be created and processed"));
    }

    console.log("\n" + "─".repeat(60) + "\n");

    // 3. Voice Conversion Demo
    console.log(chalk.yellow.bold("🔄 3. Voice Conversion API"));
    console.log(
      chalk.gray(
        "This feature converts existing audio to different voices...\n"
      )
    );

    console.log(chalk.cyan("Example usage:"));
    console.log(chalk.white("  Input: your_audio.wav"));
    console.log(chalk.white("  Target Voice: Celebrity Voice Model"));
    console.log(chalk.white("  Output: converted_audio.wav"));
    console.log(
      chalk.yellow("💡 This would upload audio and convert to the target voice")
    );
    console.log(
      chalk.green("✅ Voice conversion job would be created and processed")
    );

    console.log("\n" + "─".repeat(60) + "\n");

    // 4. Vocal Separation Demo
    console.log(chalk.yellow.bold("🎤 4. Vocal Separation API"));
    console.log(
      chalk.gray("This feature separates vocals from instrumental tracks...\n")
    );

    console.log(chalk.cyan("Example usage:"));
    console.log(chalk.white("  Input: full_song.wav"));
    console.log(chalk.white("  Outputs:"));
    console.log(chalk.white("    - vocals.wav (isolated vocals)"));
    console.log(chalk.white("    - instrumentals.wav (music only)"));
    console.log(
      chalk.yellow("💡 Perfect for karaoke, remixing, and music analysis")
    );
    console.log(
      chalk.green("✅ Vocal separation job would be created and processed")
    );

    console.log("\n" + "─".repeat(60) + "\n");

    // 5. Stem Splitter Demo
    console.log(chalk.yellow.bold("🥁 5. Stem Splitter API"));
    console.log(
      chalk.gray(
        "This feature splits audio into individual instrument stems...\n"
      )
    );

    console.log(chalk.cyan("Example usage:"));
    console.log(chalk.white("  Input: full_song.wav"));
    console.log(chalk.white("  Outputs:"));
    console.log(chalk.white("    - drums.wav"));
    console.log(chalk.white("    - bass.wav"));
    console.log(chalk.white("    - vocals.wav"));
    console.log(chalk.white("    - other.wav"));
    console.log(chalk.yellow("💡 Great for music production and remixing"));
    console.log(
      chalk.green("✅ Stem splitting job would be created and processed")
    );

    console.log("\n" + "─".repeat(60) + "\n");

    // 6. Voice Blender Demo
    console.log(chalk.yellow.bold("🎭 6. Voice Blender API"));
    console.log(
      chalk.gray("This feature blends multiple voices together...\n")
    );

    if (models.data.length >= 2) {
      console.log(chalk.cyan("Example usage:"));
      console.log(chalk.white("  Input: your_audio.wav"));
      console.log(
        chalk.white(`  Voice 1: ${models.data[0].name} (Weight: 60%)`)
      );
      console.log(
        chalk.white(`  Voice 2: ${models.data[1].name} (Weight: 40%)`)
      );
      console.log(chalk.white("  Output: blended_voice.wav"));
      console.log(chalk.yellow("💡 Create unique voice combinations"));
      console.log(
        chalk.green("✅ Voice blending job would be created and processed")
      );
    } else {
      console.log(
        chalk.yellow("💡 Requires multiple voice models for blending")
      );
    }

    console.log("\n" + "─".repeat(60) + "\n");

    // Usage Summary
    console.log(chalk.cyan.bold("🚀 CLI Usage Examples\n"));

    console.log(chalk.white("# Setup"));
    console.log(chalk.gray("kits-cli setup"));
    console.log();

    console.log(chalk.white("# Interactive mode (recommended for beginners)"));
    console.log(chalk.gray("kits-cli interactive"));
    console.log();

    console.log(chalk.white("# Voice conversion"));
    console.log(
      chalk.gray("kits-cli voice-convert input.wav --model-id 1014961")
    );
    console.log();

    console.log(chalk.white("# Text-to-speech"));
    console.log(chalk.gray('kits-cli tts "Hello world" --model-id 1014961'));
    console.log();

    console.log(chalk.white("# Vocal separation"));
    console.log(chalk.gray("kits-cli vocal-separate song.wav"));
    console.log();

    console.log(chalk.white("# Stem splitting"));
    console.log(chalk.gray("kits-cli stem-split song.wav"));
    console.log();

    console.log(chalk.white("# Voice blending"));
    console.log(
      chalk.gray(
        'kits-cli voice-blend input.wav --models "123,456" --weights "0.7,0.3"'
      )
    );
    console.log();

    console.log(chalk.white("# List voice models"));
    console.log(chalk.gray("kits-cli models list"));
    console.log();

    console.log(chalk.white("# Check job status"));
    console.log(chalk.gray("kits-cli status job_12345"));
    console.log();

    console.log(
      chalk.green.bold(
        "\n🎉 Demo completed! All Kits AI features are available in this CLI.\n"
      )
    );
    console.log(chalk.cyan("Get started with: kits-cli interactive\n"));
  } catch (error) {
    console.error(chalk.red("Demo failed:"), error.message);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    }
  }
}

// Run the demo
demoAllFeatures().catch(console.error);
