import chalk from "chalk";
import { ConfigLoader } from "../../../../core";
import { NewRouteOptions } from "./types";
import { ApiConfig } from "../../common";
import { NewRouteOptionsStrategy } from "./new-route.options-strategy";
import { NewRouteInteractiveStrategy } from "./new-route.interactive-strategy";

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
