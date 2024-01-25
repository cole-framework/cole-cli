import { ConfigLoader } from "../../../../core";
import { ApiConfig } from "../../common";
import { NewUseCaseInteractiveStrategy } from "./new-use-case.interactive-strategy";
import { NewUseCaseOptionsStrategy } from "./new-use-case.options-strategy";
import { NewUseCaseOptions } from "./types";

export const newUseCase = async (options: NewUseCaseOptions) => {
  const { content: config, failure } = ConfigLoader.load("use_case");

  if (failure) {
    console.log(failure.error.message);
    process.exit(1);
  }

  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewUseCaseOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewUseCaseInteractiveStrategy(config).apply(apiConfig);
  }
};
