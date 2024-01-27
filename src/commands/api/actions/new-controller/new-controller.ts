import chalk from "chalk";
import { ConfigLoader } from "../../../../core";
import { NewControllerOptions } from "./types";
import { ApiConfig } from "../../common";
import { NewControllerOptionsStrategy } from "./new-controller.options-strategy";
import { NewControllerInteractiveStrategy } from "./new-controller.interactive-strategy";

export const newController = async (options: NewControllerOptions) => {
  const { content: config, failure } = ConfigLoader.load("controller");

  if (failure) {
    console.log(chalk.red(failure.error.message));
    process.exit(1);
  }

  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewControllerOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewControllerInteractiveStrategy(config).apply(apiConfig);
  }
};
