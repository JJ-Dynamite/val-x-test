import chalk from "chalk";

export function showHelp() {
  console.log(chalk.cyan.bold("\n🎵 Kits AI CLI - Complete Usage Guide 🎵\n"));

  console.log(chalk.white.bold("DESCRIPTION:"));
  console.log(
    chalk.gray(
      "  A comprehensive CLI tool for Kits AI APIs including voice conversion,"
    )
  );
  console.log(
    chalk.gray(
      "  text-to-speech, vocal separation, stem splitting, and voice blending.\n"
    )
  );

  console.log(chalk.white.bold("USAGE:"));
  console.log(chalk.white("  kits-cli <command> [options] [arguments]\n"));
  console.log(chalk.white("  bun run dev <command> [options] [arguments]\n"));

  console.log(chalk.white.bold("SETUP:"));
  console.log(
    chalk.cyan("  setup                    ") +
      chalk.gray("Configure your Kits AI API key")
  );
  console.log(chalk.gray("    Example: kits-cli setup\n"));

  console.log(chalk.white.bold("VOICE CONVERSION:"));
  console.log(
    chalk.cyan("  voice-convert <input>    ") +
      chalk.gray("Convert audio to different voice")
  );
  console.log(chalk.gray("    --model-id <id>        Voice model ID to use"));
  console.log(chalk.gray("    --output <path>        Output file path"));
  console.log(
    chalk.gray(
      "    Example: kits-cli voice-convert song.wav --model-id 1470063\n"
    )
  );

  console.log(chalk.white.bold("TEXT-TO-SPEECH:"));
  console.log(
    chalk.cyan("  tts <text>               ") +
      chalk.gray("Convert text to speech")
  );
  console.log(chalk.gray("    --model-id <id>        Voice model ID to use"));
  console.log(chalk.gray("    --output <path>        Output audio file path"));
  console.log(
    chalk.gray('    Example: kits-cli tts "Hello world" --model-id 1475784\n')
  );

  console.log(chalk.white.bold("AUDIO PROCESSING:"));
  console.log(
    chalk.cyan("  vocal-separate <input>   ") +
      chalk.gray("Separate vocals from instrumentals")
  );
  console.log(
    chalk.gray(
      "    --output-dir <path>    Output directory for separated files"
    )
  );
  console.log(chalk.gray("    Example: kits-cli vocal-separate song.mp3\n"));

  console.log(
    chalk.cyan("  stem-split <input>       ") +
      chalk.gray("Split audio into stems (drums, bass, etc.)")
  );
  console.log(
    chalk.gray("    --output-dir <path>    Output directory for stem files")
  );
  console.log(chalk.gray("    Example: kits-cli stem-split track.wav\n"));

  console.log(
    chalk.cyan("  voice-blend <input>      ") +
      chalk.gray("Blend multiple voices together")
  );
  console.log(
    chalk.gray("    --models <ids>         Comma-separated voice model IDs")
  );
  console.log(
    chalk.gray("    --weights <values>     Comma-separated blend weights (0-1)")
  );
  console.log(chalk.gray("    --output <path>        Output file path"));
  console.log(
    chalk.gray(
      "    Example: kits-cli voice-blend audio.wav --models 1470063,1475784 --weights 0.6,0.4\n"
    )
  );

  console.log(chalk.white.bold("VOICE MODELS:"));
  console.log(
    chalk.cyan("  models list              ") +
      chalk.gray("List available voice models")
  );
  console.log(
    chalk.gray("    --page <number>        Page number (default: 1)")
  );
  console.log(
    chalk.gray("    --limit <number>       Models per page (default: 20)")
  );
  console.log(
    chalk.gray("    Example: kits-cli models list --page 2 --limit 10\n")
  );

  console.log(
    chalk.cyan("  models get <modelId>     ") +
      chalk.gray("Get details of specific voice model")
  );
  console.log(chalk.gray("    Example: kits-cli models get 1470063\n"));

  console.log(chalk.white.bold("JOB MANAGEMENT:"));
  console.log(
    chalk.cyan("  status <jobId>           ") +
      chalk.gray("Check processing job status")
  );
  console.log(chalk.gray("    Example: kits-cli status job_12345\n"));

  console.log(chalk.white.bold("INTERACTIVE MODE:"));
  console.log(
    chalk.cyan("  interactive              ") +
      chalk.gray("Launch interactive menu-driven interface")
  );
  console.log(chalk.gray("    Example: kits-cli interactive\n"));

  console.log(chalk.white.bold("GLOBAL OPTIONS:"));
  console.log(
    chalk.gray(
      "  --api-key <key>          Kits AI API key (or use KITS_API_KEY env var)"
    )
  );
  console.log(chalk.gray("  --verbose                Enable verbose logging"));
  console.log(chalk.gray("  --help                   Show this help message"));
  console.log(chalk.gray("  --version                Show version number\n"));

  console.log(chalk.white.bold("SUPPORTED AUDIO FORMATS:"));
  console.log(chalk.gray("  Input:  WAV, MP3, FLAC, M4A, OGG (max 100MB)"));
  console.log(chalk.gray("  Output: WAV, MP3 (depending on the operation)\n"));

  console.log(chalk.white.bold("CONFIGURATION:"));
  console.log(chalk.gray("  API Key: Stored in ~/.kits-cli/config.json"));
  console.log(chalk.gray("  Env Var: KITS_API_KEY in .env file"));
  console.log(chalk.gray("  Get API Key: https://kits.ai/api-access\n"));

  console.log(chalk.white.bold("EXAMPLES:"));
  console.log(chalk.yellow("  # Setup API key"));
  console.log(chalk.white("  kits-cli setup\n"));

  console.log(chalk.yellow("  # Browse voice models"));
  console.log(chalk.white("  kits-cli models list\n"));

  console.log(chalk.yellow("  # Convert voice using interactive mode"));
  console.log(chalk.white("  kits-cli interactive\n"));

  console.log(chalk.yellow("  # Quick voice conversion"));
  console.log(
    chalk.white("  kits-cli voice-convert my-audio.wav --model-id 1470063\n")
  );

  console.log(chalk.yellow("  # Text to speech"));
  console.log(
    chalk.white('  kits-cli tts "Hello, this is a test" --model-id 1475784\n')
  );

  console.log(chalk.yellow("  # Separate vocals from music"));
  console.log(
    chalk.white("  kits-cli vocal-separate song.mp3 --output-dir ./separated\n")
  );

  console.log(chalk.white.bold("GETTING STARTED:"));
  console.log(
    chalk.gray("  1. Get your API key from https://kits.ai/api-access")
  );
  console.log(chalk.gray("  2. Run: kits-cli setup"));
  console.log(chalk.gray("  3. Explore: kits-cli interactive"));
  console.log(chalk.gray("  4. List models: kits-cli models list"));
  console.log(
    chalk.gray("  5. Start converting: kits-cli voice-convert your-audio.wav\n")
  );

  console.log(chalk.white.bold("MORE INFO:"));
  console.log(chalk.gray("  Documentation: https://docs.kits.ai"));
  console.log(
    chalk.gray("  API Reference: https://docs.kits.ai/api-reference")
  );
  console.log(chalk.gray("  GitHub: https://github.com/your-repo/kits-cli\n"));
}
