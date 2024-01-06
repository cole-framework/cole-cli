import { ConfigLoader, WriteMethod } from "../../../../core";
import { FileTransport } from "../../../../transport/file.transport";
import { ApiGenerator } from "../api-generator";
import { ApiData } from "../api.types";
import {
  NewUseCaseInteractiveStrategy,
  NewUseCaseJsonStrategy,
  NewUseCaseOptionsStrategy,
} from "./strategies";
import { NewUseCaseOptions } from "./types";

export const newUseCase = async (options: NewUseCaseOptions) => {
  const { content: config, failure } = ConfigLoader.load("use_case");

  if (failure) {
    console.log(failure.error.message);
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

  if (!options || Object.keys(options).length === 0) {
    new NewUseCaseInteractiveStrategy(config).apply(schema);
  } else if (options.json) {
    new NewUseCaseJsonStrategy(config).apply(schema, options.json);
  } else {
    new NewUseCaseOptionsStrategy(config).apply(schema, options);
  }

  const result = new ApiGenerator(config, new FileTransport()).generate(schema);

  if (result.isFailure) {
    console.log(result.failure.error.message);
    process.exit(1);
  }
};
