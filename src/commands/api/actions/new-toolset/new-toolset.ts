import chalk from "chalk";
import { ConfigLoader } from "../../../../core";
import { NewToolsetOptions } from "./types";
import { ApiConfig } from "../../common";
import { NewToolsetOptionsStrategy } from "./new-toolset.options-strategy";
import { NewToolsetInteractiveStrategy } from "./new-toolset.interactive-strategy";

export const newToolset = async (options: NewToolsetOptions) => {
  const { content: config, failure } = ConfigLoader.load("toolset");

  if (failure) {
    console.log(chalk.red(failure.error));
    process.exit(1);
  }

  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewToolsetOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewToolsetInteractiveStrategy(config).apply(apiConfig);
  }
};
