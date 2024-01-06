import chalk from "chalk";
import { ConfigLoader, WriteMethod } from "../../../../core";
import { FileTransport } from "../../../../transport/file.transport";
import { ApiGenerator } from "../api-generator";
import {
  // NewEntityInteractiveStrategy,
  NewEntityJsonStrategy,
  NewEntityOptionsStrategy,
} from "./strategies";
import { NewEntityOptions } from "./types";
import { ApiData } from "../api.types";

export const newEntity = async (options: NewEntityOptions) => {
  const { content: config, failure } = ConfigLoader.load("entity");

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

  if (options.json) {
    new NewEntityJsonStrategy(config).apply(schema, options.json);
  } else if (Object.keys(options).includes("name")) {
    new NewEntityOptionsStrategy(config).apply(schema, options);
  } else {
    // new NewEntityInteractiveStrategy(config).apply(schema);
  }

  const result = new ApiGenerator(config, new FileTransport()).generate(schema);

  if (result.isFailure) {
    console.log(result.failure.error);
    process.exit(1);
  }
};
