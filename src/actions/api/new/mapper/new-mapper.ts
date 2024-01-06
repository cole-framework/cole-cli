import { ComponentType, ConfigLoader, WriteMethod } from "../../../../core";
import { FileTransport } from "../../../../transport/file.transport";
import { ApiGenerator } from "../api-generator";
import { ApiData } from "../api.types";
import {
  // NewMapperInteractiveStrategy,
  NewMapperJsonStrategy,
  NewMapperOptionsStrategy,
} from "./strategies";
import { NewMapperOptions } from "./types";

export const newMapper = async (options: NewMapperOptions) => {
  const { content: config, failure } = ConfigLoader.load("mapper");

  if (failure) {
    console.log(failure.error);
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
    // new NewMapperInteractiveStrategy(config).apply(schema);
  } else if (options.json) {
    new NewMapperJsonStrategy(config).apply(schema, options.json);
  } else {
    new NewMapperOptionsStrategy(config).apply(schema, options);
  }

  const result = new ApiGenerator(config, new FileTransport()).generate(schema);

  if (result.isFailure) {
    console.log(result.failure.error);
    process.exit(1);
  }
};
