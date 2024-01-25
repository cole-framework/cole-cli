import { ConfigLoader } from "../../../../core";
import { ApiConfig } from "../../common";
import { NewSourceInteractiveStrategy } from "./new-source.interactive-strategy";
import { NewSourceOptionsStrategy } from "./new-source.options-strategy";
import { NewSourceOptions } from "./types";

export const newSource = async (options: NewSourceOptions) => {
  const { content: config, failure } = ConfigLoader.load("source");

  if (failure) {
    console.log(failure.error.message);
    process.exit(1);
  }

  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewSourceOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewSourceInteractiveStrategy(config).apply(apiConfig);
  }
};
