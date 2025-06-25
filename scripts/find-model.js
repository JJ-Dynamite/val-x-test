#!/usr/bin/env node

import { KitsAIService } from "../src/kits-service.js";
import chalk from "chalk";
import ora from "ora";

async function findModel(searchName) {
  const service = new KitsAIService();

  if (!service.apiKey) {
    console.error(chalk.red("❌ No API key found. Please run setup first."));
    process.exit(1);
  }

  console.log(
    chalk.cyan.bold("\n🔍 Searching for voice model: ") +
      chalk.white(searchName)
  );

  const spinner = ora("Searching through all voice models...").start();

  let found = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    // Get first page to determine total pages
    const firstResponse = await service.getVoiceModels(1, 20);
    totalPages = firstResponse.meta.lastPage;

    spinner.text = `Searching through ${totalPages} pages...`;

    // Search through all pages
    for (let page = 1; page <= totalPages; page++) {
      const response = await service.getVoiceModels(page, 20);

      response.data.forEach((model) => {
        const modelName = model.title || model.name || "";
        if (modelName.toLowerCase().includes(searchName.toLowerCase())) {
          found.push({
            ...model,
            page: page,
          });
        }
      });

      spinner.text = `Searched ${page}/${totalPages} pages... Found ${found.length} matches`;
    }

    spinner.stop();

    if (found.length === 0) {
      console.log(
        chalk.yellow("\n⚠️  No models found matching: ") +
          chalk.white(searchName)
      );
      console.log(chalk.gray("\nPossible reasons:"));
      console.log(
        chalk.gray("• Model is private/personal and not in public listings")
      );
      console.log(chalk.gray("• Model is still training"));
      console.log(chalk.gray("• Model name might be different"));
      console.log(
        chalk.gray(
          "• Model might be accessible through different API endpoints"
        )
      );
    } else {
      console.log(
        chalk.green(
          `\n✅ Found ${found.length} model(s) matching "${searchName}":\n`
        )
      );

      found.forEach((model, index) => {
        console.log(
          chalk.cyan(
            `${index + 1}. ${model.title || model.name || "Unnamed Model"}`
          )
        );
        console.log(chalk.gray(`   ID: ${model.id}`));
        console.log(chalk.gray(`   Page: ${model.page}`));

        if (model.tags && model.tags.length > 0) {
          console.log(chalk.gray(`   Tags: ${model.tags.join(", ")}`));
        }

        if (model.demoUrl) {
          console.log(chalk.gray(`   Demo: ${model.demoUrl}`));
        }

        if (model.isUsable !== undefined) {
          console.log(
            chalk.gray(`   Available: ${model.isUsable ? "Yes" : "No"}`)
          );
        }

        console.log();
      });
    }
  } catch (error) {
    spinner.fail("Search failed");
    console.error(chalk.red("Error:"), error.message);

    if (error.response) {
      console.error(chalk.red("API Error:"), error.response.data);
    }
  }
}

// Get search term from command line arguments
const searchName = process.argv[2];

if (!searchName) {
  console.log(chalk.yellow('Usage: node scripts/find-model.js "model name"'));
  console.log(
    chalk.gray('Example: node scripts/find-model.js "Joel J Mathew"')
  );
  process.exit(1);
}

findModel(searchName);
