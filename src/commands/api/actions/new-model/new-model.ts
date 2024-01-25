import chalk from "chalk";
import { NewModelOptions } from "./types";
import { ConfigLoader } from "../../../../core";
import { NewModelInteractiveStrategy } from "./new-model.interactive-strategy";
import { NewModelOptionsStrategy } from "./new-model.options-strategy";
import { ApiConfig } from "../../common";

export const newModel = async (options: NewModelOptions) => {
  const { content: config, failure } = ConfigLoader.load("model");

  if (failure) {
    console.log(chalk.red(failure.error));
    process.exit(1);
  }

  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewModelOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewModelInteractiveStrategy(config).apply(apiConfig);
  }
};
