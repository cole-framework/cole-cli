import chalk from "chalk";
import { FileTransport } from "../../../../transport/file.transport";
import { ApiGenerator } from "../api-generator";
import { NewModelOptionsStrategy } from "./strategies";
import { NewModelOptions } from "./types";
import { ConfigLoader, WriteMethod } from "../../../../core";
import { ApiData } from "../api.types";

export const newModel = async (options: NewModelOptions) => {
  const { content: config, failure } = ConfigLoader.load("model");

  if (failure) {
    console.log(chalk.red(failure.error));
    process.exit(1);
  }

  const schema: ApiData = {
    config: {
      skip_tests:
        options.skipTests === undefined
          ? config.general.skipTests
          : options.skipTests,
      with_dependencies:
        options.withDeps === undefined
          ? config.general.withDependencies
          : options.withDeps,
      use_cwd: false,
      force: options.force,
      write_method: options.force ? WriteMethod.Overwrite : WriteMethod.Write,
    },
    components: [],
  };

  if (Object.keys(options).includes("name")) {
    new NewModelOptionsStrategy(config).apply(schema, options);
  } else {
    // new NewModelInteractiveStrategy(config).apply(schema);
  }

  const result = new ApiGenerator(config, new FileTransport()).generate(schema);

  if (result.isFailure) {
    console.log(result.failure.error);
    process.exit(1);
  }
};
