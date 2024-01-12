import chalk from "chalk";
import { ConfigLoader, WriteMethod } from "../../../../core";
import { FileTransport } from "../../../../transport/file.transport";
import { ApiGenerator } from "../api-generator";
import {
  NewControllerInteractiveStrategy,
  NewControllerOptionsStrategy,
} from "./strategies";
import { NewControllerOptions } from "./types";
import { ApiData } from "../api.types";

export const newController = async (options: NewControllerOptions) => {
  const { content: config, failure } = ConfigLoader.load("controller");

  if (failure) {
    console.log(chalk.red(failure.error.message));
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
    new NewControllerOptionsStrategy(config).apply(schema, options);
  } else {
    new NewControllerInteractiveStrategy(config).apply(schema);
  }

  // const result = new ApiGenerator(new FileTransport()).generate(schema);

  // if (result.isFailure) {
  //   console.log(result.failure.error.message);
  //   process.exit(1);
  // }
};
