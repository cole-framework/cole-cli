import chalk from "chalk";
import { ConfigLoader } from "../../../../core";
import { NewEntityOptions } from "./types";
import { NewEntityOptionsStrategy } from "./new-entity.options-strategy";
import { NewEntityInteractiveStrategy } from "./new-entity.interactive-strategy";
import { ApiConfig } from "../../common/api.config";

export const newEntity = async (options: NewEntityOptions) => {
  const { content: config, failure } = ConfigLoader.load("entity");

  if (failure) {
    console.log(chalk.red(failure.error));
    process.exit(1);
  }
  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewEntityOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewEntityInteractiveStrategy(config).apply(apiConfig);
  }
};
