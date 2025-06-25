import axios from "axios";
import FormData from "form-data";
import fs from "fs-extra";
import path from "path";
import { config } from "./config.js";

export class KitsAIService {
  constructor(apiKey) {
    this.apiKey = apiKey || config.getApiKey();
    this.baseURL = "https://arpeggi.io/api/kits/v1";

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 300000, // 5 minutes timeout for large file uploads
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "User-Agent": "kits-cli/1.0.0",
      },
      // Add retry configuration
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 300; // Accept 2xx status codes
      },
    });

    // Add request interceptor for better error handling
    this.client.interceptors.request.use(
      (config) => {
        // Log request for debugging
        if (process.env.NODE_ENV === "development") {
          console.log(
            `Making ${config.method?.toUpperCase()} request to: ${config.url}`
          );
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for better error handling
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.code === "ETIMEDOUT") {
          throw new Error(
            `Request timed out. The server took too long to respond. This might be due to a large file upload or server load. Please try again.`
          );
        } else if (error.code === "ECONNREFUSED") {
          throw new Error(
            `Connection refused. Please check your internet connection and try again.`
          );
        } else if (error.code === "ENOTFOUND") {
          throw new Error(
            `Could not resolve host. Please check your internet connection.`
          );
        } else if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;
          throw new Error(
            `API Error (${status}): ${
              data?.message || data?.error || "Unknown error"
            }`
          );
        } else if (error.request) {
          // Request was made but no response received
          throw new Error(
            `No response received from server. Please check your internet connection and try again.`
          );
        } else {
          // Something else happened
          throw new Error(`Request failed: ${error.message}`);
        }
      }
    );
  }

  // Voice Conversion API
  async voiceConversion(audioFilePath, voiceModelId, options = {}) {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    // Check file size (max 100MB)
    const stats = fs.statSync(audioFilePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    if (fileSizeInMB > 100) {
      throw new Error(
        `File size (${fileSizeInMB.toFixed(
          2
        )}MB) exceeds the maximum limit of 100MB`
      );
    }

    const formData = new FormData();
    formData.append("voiceModelId", voiceModelId);
    formData.append("soundFile", fs.createReadStream(audioFilePath));

    if (options.conversionStrength !== undefined) {
      formData.append("conversionStrength", options.conversionStrength);
    }

    if (options.modelVolumeMix !== undefined) {
      formData.append("modelVolumeMix", options.modelVolumeMix);
    }

    if (options.pitchShift !== undefined) {
      formData.append("pitchShift", options.pitchShift);
    }

    if (options.preprocessingEffects) {
      formData.append(
        "preprocessingEffects",
        JSON.stringify(options.preprocessingEffects)
      );
    }

    if (options.postprocessingEffects) {
      formData.append(
        "postprocessingEffects",
        JSON.stringify(options.postprocessingEffects)
      );
    }

    const response = await this.client.post("/voice-conversions", formData, {
      headers: formData.getHeaders(),
      timeout: 600000, // 10 minutes for file uploads
    });

    return response.data;
  }

  // Get Voice Conversions
  async getVoiceConversions(page = 1, limit = 20) {
    const response = await this.client.get("/voice-conversions", {
      params: { page, limit },
    });
    return response.data;
  }

  // Get specific Voice Conversion
  async getVoiceConversion(jobId) {
    const response = await this.client.get(`/voice-conversions/${jobId}`);
    return response.data;
  }

  // Voice Model API
  async getVoiceModels(page = 1, limit = 20) {
    const response = await this.client.get("/voice-models", {
      params: { page, limit },
    });
    return response.data;
  }

  async getVoiceModel(modelId) {
    const response = await this.client.get(`/voice-models/${modelId}`);
    return response.data;
  }

  // Text-to-Speech API
  async textToSpeech(text, voiceModelId, options = {}) {
    const formData = new FormData();
    formData.append("inputTtsText", text);
    formData.append("voiceModelId", voiceModelId);

    if (options.preprocessingEffects) {
      formData.append(
        "preprocessingEffects",
        JSON.stringify(options.preprocessingEffects)
      );
    }

    if (options.postprocessingEffects) {
      formData.append(
        "postprocessingEffects",
        JSON.stringify(options.postprocessingEffects)
      );
    }

    const response = await this.client.post("/tts", formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  }

  // Get Text-to-Speech jobs
  async getTextToSpeechJobs(page = 1, limit = 20) {
    const response = await this.client.get("/tts", {
      params: { page, limit },
    });
    return response.data;
  }

  // Get specific TTS job
  async getTextToSpeechJob(jobId) {
    const response = await this.client.get(`/tts/${jobId}`);
    return response.data;
  }

  // Vocal Separations API
  async vocalSeparation(audioFilePath, options = {}) {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    const formData = new FormData();
    formData.append("soundFile", fs.createReadStream(audioFilePath));

    if (options.outputFormat) {
      formData.append("outputFormat", options.outputFormat);
    }

    const response = await this.client.post("/vocal-separations", formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  }

  // Get Vocal Separations
  async getVocalSeparations(page = 1, limit = 20) {
    const response = await this.client.get("/vocal-separations", {
      params: { page, limit },
    });
    return response.data;
  }

  // Get specific Vocal Separation
  async getVocalSeparation(jobId) {
    const response = await this.client.get(`/vocal-separations/${jobId}`);
    return response.data;
  }

  // Stem Splitter API
  async stemSplitter(audioFilePath, options = {}) {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    const formData = new FormData();
    formData.append("soundFile", fs.createReadStream(audioFilePath));

    if (options.outputFormat) {
      formData.append("outputFormat", options.outputFormat);
    }

    const response = await this.client.post("/stem-splitter", formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  }

  // Get Stem Splitter jobs
  async getStemSplitterJobs(page = 1, limit = 20) {
    const response = await this.client.get("/stem-splitter", {
      params: { page, limit },
    });
    return response.data;
  }

  // Get specific Stem Splitter job
  async getStemSplitterJob(jobId) {
    const response = await this.client.get(`/stem-splitter/${jobId}`);
    return response.data;
  }

  // Voice Blender API
  async voiceBlender(audioFilePath, voiceModelIds, blendWeights, options = {}) {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    const formData = new FormData();
    formData.append("soundFile", fs.createReadStream(audioFilePath));
    formData.append("voiceModelIds", JSON.stringify(voiceModelIds));
    formData.append("blendWeights", JSON.stringify(blendWeights));

    if (options.preprocessingEffects) {
      formData.append(
        "preprocessingEffects",
        JSON.stringify(options.preprocessingEffects)
      );
    }

    if (options.postprocessingEffects) {
      formData.append(
        "postprocessingEffects",
        JSON.stringify(options.postprocessingEffects)
      );
    }

    const response = await this.client.post("/voice-blender", formData, {
      headers: formData.getHeaders(),
    });

    return response.data;
  }

  // Get Voice Blender jobs
  async getVoiceBlenderJobs(page = 1, limit = 20) {
    const response = await this.client.get("/voice-blender", {
      params: { page, limit },
    });
    return response.data;
  }

  // Get specific Voice Blender job
  async getVoiceBlenderJob(jobId) {
    const response = await this.client.get(`/voice-blender/${jobId}`);
    return response.data;
  }

  // Download result file
  async downloadFile(url, outputPath) {
    const response = await axios.get(url, {
      responseType: "stream",
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }

  // Poll job status until completion
  async pollJobStatus(jobId, jobType, onProgress = null) {
    const getJobMethod = this.getJobMethod(jobType);
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    while (attempts < maxAttempts) {
      try {
        const job = await getJobMethod(jobId);

        if (onProgress) {
          onProgress(job);
        }

        if (job.status === "completed") {
          return job;
        } else if (job.status === "failed") {
          throw new Error(`Job failed: ${job.error || "Unknown error"}`);
        }

        // Wait 5 seconds before next check
        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error(`Job not found: ${jobId}`);
        }
        throw error;
      }
    }

    throw new Error("Job polling timed out after 5 minutes");
  }

  getJobMethod(jobType) {
    const methods = {
      "voice-conversion": this.getVoiceConversion.bind(this),
      "text-to-speech": this.getTextToSpeechJob.bind(this),
      "vocal-separation": this.getVocalSeparation.bind(this),
      "stem-splitter": this.getStemSplitterJob.bind(this),
      "voice-blender": this.getVoiceBlenderJob.bind(this),
    };

    return methods[jobType] || this.getVoiceConversion.bind(this);
  }
}
