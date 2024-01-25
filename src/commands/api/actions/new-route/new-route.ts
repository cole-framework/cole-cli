import chalk from "chalk";
import { ConfigLoader, WriteMethod } from "../../../../core";
import {
  NewRouteInteractiveStrategy,
  NewRouteOptionsStrategy,
} from "./strategies";
import { NewRouteOptions } from "./types";
import { ApiConfig } from "../../common";

export const newRoute = async (options: NewRouteOptions) => {
  const { content: config, failure } = ConfigLoader.load("route");

  if (failure) {
    console.log(chalk.red(failure.error.message));
    process.exit(1);
  }

  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewRouteOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewRouteInteractiveStrategy(config).apply(apiConfig);
  }
};
