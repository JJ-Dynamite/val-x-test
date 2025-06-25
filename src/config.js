import fs from "fs-extra";
import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".kits-cli");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

class Config {
  constructor() {
    this.ensureConfigDir();
  }

  ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
  }

  getConfig() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        return fs.readJsonSync(CONFIG_FILE);
      }
    } catch (error) {
      console.warn("Error reading config file:", error.message);
    }
    return {};
  }

  setConfig(config) {
    try {
      fs.writeJsonSync(CONFIG_FILE, config, { spaces: 2 });
      return true;
    } catch (error) {
      console.error("Error writing config file:", error.message);
      return false;
    }
  }

  getApiKey() {
    const config = this.getConfig();
    return config.apiKey || process.env.KITS_API_KEY;
  }

  setApiKey(apiKey) {
    const config = this.getConfig();
    config.apiKey = apiKey;
    return this.setConfig(config);
  }

  removeApiKey() {
    const config = this.getConfig();
    delete config.apiKey;
    return this.setConfig(config);
  }
}

export const config = new Config();
