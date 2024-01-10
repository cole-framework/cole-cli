import chalk from "chalk";
import { ConfigLoader, WriteMethod } from "../../../../core";
import { FileTransport } from "../../../../transport/file.transport";
import { ApiGenerator } from "../api-generator";
import {
  NewRouteInteractiveStrategy,
  NewRouteOptionsStrategy,
} from "./strategies";
import { NewRouteOptions } from "./types";
import { ApiData } from "../api.types";

export const newRoute = async (options: NewRouteOptions) => {
  const { content: config, failure } = ConfigLoader.load("route");

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
    new NewRouteOptionsStrategy(config).apply(schema, options);
  } else {
    new NewRouteInteractiveStrategy(config).apply(schema);
  }

  const result = new ApiGenerator(config, new FileTransport()).generate(schema);

  if (result.isFailure) {
    console.log(result.failure.error.message);
    process.exit(1);
  }
};
