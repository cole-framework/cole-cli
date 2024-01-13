import chalk from "chalk";
import { ConfigLoader, WriteMethod } from "../../../../core";
import { FileTransport } from "../../../../transport/file.transport";
import { ApiGenerator } from "../api-generator";
import { NewToolOptionsStrategy } from "./strategies";
import { NewToolOptions } from "./types";
import { ApiData } from "../api.types";

export const newTool = async (options: NewToolOptions) => {
  const { content: config, failure } = ConfigLoader.load("tool");

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
    new NewToolOptionsStrategy(config).apply(schema, options);
  } else {
    // new NewToolInteractiveStrategy(config).apply(schema);
  }

  // const result = new ApiGenerator(new FileTransport()).generate(schema);

  // if (result.isFailure) {
  //   console.log(result.failure.error);
  //   process.exit(1);
  // }
};
