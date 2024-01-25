import { ConfigLoader } from "../../../../core";
import { ApiConfig } from "../../common";
import { NewRepositoryInteractiveStrategy } from "./new-repository.interactive-strategy";
import { NewRepositoryOptionsStrategy } from "./new-repository.options-strategy";
import { NewRepositoryOptions } from "./types";

export const newRepository = async (options: NewRepositoryOptions) => {
  const { content: config, failure } = ConfigLoader.load("repository");

  if (failure) {
    console.log(failure.error);
    process.exit(1);
  }

  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewRepositoryOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewRepositoryInteractiveStrategy(config).apply(apiConfig);
  }
};
