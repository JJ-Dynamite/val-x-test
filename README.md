# Kits AI CLI 🎵

A comprehensive command-line interface for [Kits AI](https://docs.kits.ai/), featuring all API capabilities including voice conversion, text-to-speech, vocal separation, stem splitting, and voice blending.

## 🎯 Features

This CLI tool provides access to **all** Kits AI features:

### 🔄 Voice Conversion API

- Convert audio files to different voice models
- Apply preprocessing and postprocessing effects
- Support for various audio formats (WAV, MP3, FLAC)
- Customizable conversion strength, volume mix, and pitch shift

### 🎙️ Text-to-Speech API

- Convert text to speech using any voice model
- Customizable voice parameters
- High-quality audio output

### 🎤 Vocal Separations API

- Separate vocals from instrumental tracks
- Extract clean vocals or instrumentals
- Perfect for remixing and karaoke

### 🥁 Stem Splitter API

- Split audio into individual stems (drums, bass, vocals, etc.)
- Isolate specific instruments
- Great for music production

### 🎭 Voice Blender API

- Blend multiple voices together
- Customizable blend weights
- Create unique voice combinations

### 📋 Voice Model API

- Browse available voice models
- Get detailed model information
- Search and filter models

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- NPM or Yarn
- Kits AI API key ([Get yours here](https://docs.kits.ai/api-reference))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kits-ai-cli

# Install dependencies
bun install

# Make CLI executable
chmod +x index.js

# Install globally (optional)
npm install -g .
```

### Setup

1. Get your API key from [Kits AI API Access Page](https://docs.kits.ai/api-reference)

2. Configure the CLI:

```bash
bun run setup
# or
bun run dev setup
```

3. **Get help and explore:**

```bash
# Show detailed help guide with all commands and examples
bun run help

# Show available commands overview
bun run dev

# Interactive mode - guided experience for all features
bun run interactive

# Quick access to voice models
bun run models
```

4. **Quick start examples:**

```bash
# Browse voice models first
bun run dev models list

# Convert voice (interactive model selection)
bun run dev voice-convert your-audio.wav

# Text to speech
bun run dev tts "Hello, this is a test"
```

## 📚 Usage Examples

### Voice Conversion

```bash
# Convert with interactive model selection
node index.js voice-convert input.wav

# Convert with specific model and options
node index.js voice-convert input.wav --model-id 1014961 --output converted.wav

# Advanced conversion with parameters
node index.js voice-convert input.wav --model-id 1014961 \
  --conversion-strength 0.8 --pitch-shift 2 --output result.wav
```

### Text-to-Speech

```bash
# TTS with interactive model selection
node index.js tts "Hello, this is a test of text-to-speech!"

# TTS with specific model
node index.js tts "Hello world" --model-id 1014961 --output speech.wav
```

### Vocal Separation

```bash
# Separate vocals from instrumentals
node index.js vocal-separate song.wav --output-dir separated/

# This creates:
# separated/vocals.wav
# separated/instrumentals.wav
```

### Stem Splitting

```bash
# Split into individual stems
node index.js stem-split song.wav --output-dir stems/

# This creates:
# stems/drums.wav
# stems/bass.wav
# stems/vocals.wav
# stems/other.wav
```

### Voice Blending

```bash
# Blend voices interactively
node index.js voice-blend input.wav

# Blend with specific models and weights
node index.js voice-blend input.wav --models "123,456" --weights "0.7,0.3" --output blended.wav

# Blend multiple voices
node index.js voice-blend input.wav --models "123,456,789" --weights "0.5,0.3,0.2"
```

### Voice Models

```bash
# List all models
node index.js models list

# Get specific model details
node index.js models get 1014961

# Browse with pagination
node index.js models list --page 2 --limit 10
```

### Job Management

```bash
# Check job status
node index.js status job_12345

# The CLI automatically polls for completion, but you can check manually
```

## 🎛️ Interactive Mode

Launch interactive mode for a guided experience:

```bash
node index.js interactive
```

This provides a menu-driven interface to explore all features without remembering command syntax.

## 🔧 Configuration

### API Key Management

```bash
# Set up API key
node index.js setup

# Update API key in interactive mode
node index.js interactive
# Then choose "Configuration" > "Update API key"
```

### Environment Variables

You can also set your API key as an environment variable:

```bash
export KITS_API_KEY="your_api_key_here"
```

Or create a `.env` file (see `.env.example`):

```env
KITS_API_KEY=your_api_key_here
```

## 📖 Command Reference

### Global Options

- `--api-key <key>` - Override API key
- `--verbose` - Enable verbose logging
- `--help` - Show help information

### Commands

#### `setup`

Configure API key for first-time setup

#### `voice-convert <input>`

Convert audio to different voice

- `--model-id <id>` - Voice model ID
- `--output <path>` - Output file path

#### `tts <text>`

Convert text to speech

- `--model-id <id>` - Voice model ID
- `--output <path>` - Output file path

#### `vocal-separate <input>`

Separate vocals from instrumentals

- `--output-dir <dir>` - Output directory

#### `stem-split <input>`

Split audio into stems

- `--output-dir <dir>` - Output directory

#### `voice-blend <input>`

Blend multiple voices

- `--models <ids>` - Comma-separated model IDs
- `--weights <values>` - Comma-separated weights (0-1)
- `--output <path>` - Output file path

#### `models list`

List available voice models

- `--page <number>` - Page number
- `--limit <number>` - Models per page

#### `models get <modelId>`

Get specific model details

#### `status <jobId>`

Check job processing status

#### `interactive`

Launch interactive mode

## 🎵 Supported Audio Formats

### Input Formats

- WAV (recommended)
- MP3
- FLAC
- Maximum file size: 100MB

### Output Formats

- WAV (high quality)
- Automatic format optimization

## 🔄 Job Processing

All audio processing jobs are asynchronous:

1. **Job Creation** - Upload and create processing job
2. **Queue** - Job enters processing queue
3. **Processing** - AI processes your audio
4. **Completion** - Download results automatically

The CLI automatically handles polling and downloads completed results.

## 🐛 Error Handling

The CLI includes comprehensive error handling:

- Network connection issues
- Invalid API keys
- File not found errors
- API rate limiting (429 errors)
- Job processing failures
- Invalid audio formats

Errors are displayed with helpful messages and suggestions for resolution.

## 🔒 Security

- API keys are stored locally in `~/.kits-cli/config.json`
- Keys are masked in output for security
- No sensitive data is logged or transmitted except to Kits AI API
- Configuration files have restricted permissions

## 🛠️ Development

### Project Structure

```
kits-ai-cli/
├── index.js              # Main CLI entry point
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── src/
│   ├── config.js         # Configuration management
│   ├── kits-service.js   # Kits AI API service
│   └── commands/         # Command implementations
│       ├── setup.js      # API key setup
│       ├── voice-convert.js # Voice conversion
│       ├── tts.js        # Text-to-speech
│       ├── vocal-separate.js # Vocal separation
│       ├── stem-split.js # Stem splitting
│       ├── voice-blend.js # Voice blending
│       ├── models.js     # Voice model management
│       ├── status.js     # Job status checking
│       └── interactive.js # Interactive mode
├── examples/
│   ├── demo.js           # Feature demonstration
│   └── basic-usage.js    # Simple usage examples
└── README.md
```

### Built With

- [cli-kit](https://www.npmjs.com/package/cli-kit) - CLI framework
- [axios](https://axios-http.com/) - HTTP client
- [form-data](https://www.npmjs.com/package/form-data) - Multipart form handling
- [inquirer](https://www.npmjs.com/package/inquirer) - Interactive prompts
- [chalk](https://www.npmjs.com/package/chalk) - Terminal colors
- [ora](https://www.npmjs.com/package/ora) - Loading spinners
- [fs-extra](https://www.npmjs.com/package/fs-extra) - Enhanced file system

### Running Examples

```bash
# Run comprehensive demo
node examples/demo.js

# Run basic usage examples
node examples/basic-usage.js
```

## 🚨 Rate Limits

Kits AI API has rate limits:

- Follow the API documentation for current limits
- The CLI handles rate limiting gracefully
- Contact Kits AI support to increase limits if needed

## 🔗 API Reference

For detailed API documentation, visit:

- [Kits AI Documentation](https://docs.kits.ai/)
- [API Reference](https://docs.kits.ai/api-reference)
- [Quick Start Guide](https://docs.kits.ai/api-reference/introduction/quick-start)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- [Kits AI Documentation](https://docs.kits.ai/)
- [Kits AI API Reference](https://docs.kits.ai/api-reference)
- GitHub Issues for CLI-specific problems
- Check the `examples/` directory for usage patterns

## 🎉 Acknowledgments

- Thanks to the Kits AI team for providing the comprehensive API
- Built with love for the audio and music creation community
- Special thanks to the open-source community for the amazing tools

---

**Author**: Joel J Mathew  
**Version**: 1.0.0  
**License**: MIT
