import { ConfigLoader } from "../../../../core";
import { ApiConfig } from "../../common";
import { NewMapperInteractiveStrategy } from "./new-mapper.interactive-strategy";
import { NewMapperOptionsStrategy } from "./new-mapper.options-strategy";
import { NewMapperOptions } from "./types";

export const newMapper = async (options: NewMapperOptions) => {
  const { content: config, failure } = ConfigLoader.load("mapper");

  if (failure) {
    console.log(failure.error);
    process.exit(1);
  }

  const apiConfig = ApiConfig.create(options, config);

  if (Object.keys(options).includes("name")) {
    new NewMapperOptionsStrategy(config).apply(apiConfig, options);
  } else {
    new NewMapperInteractiveStrategy(config).apply(apiConfig);
  }
};
