import { WriteMethod } from "../../../core";
import { Config } from "../../../core";
import { DefaultCliOptions } from "./api.types";

export class ProjectConfig {
  static create(options: DefaultCliOptions, config: Config) {
    const with_dependencies =
      options.withDeps === undefined
        ? config.general.withDependencies
        : options.withDeps;
    const write_method = options.force
      ? WriteMethod.Overwrite
      : WriteMethod.Write;
    const skip_tests =
      options.skipTests === undefined
        ? config.general.skipTests
        : options.skipTests;
    const dependencies_write_method = with_dependencies
      ? write_method
      : WriteMethod.Skip;

    return new ProjectConfig(
      skip_tests,
      with_dependencies,
      false,
      options.force,
      write_method,
      dependencies_write_method
    );
  }

  constructor(
    public readonly skip_tests: boolean,
    public readonly with_dependencies: boolean,
    public readonly use_cwd: boolean,
    public readonly force: boolean,
    public readonly write_method: WriteMethod,
    public readonly dependencies_write_method: WriteMethod
  ) {}
}
