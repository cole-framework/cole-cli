import { existsSync, readFileSync } from "fs";
import {
  ConfigIssues,
  ConfigWarnings,
  InvalidConfigError,
} from "./config.errors";

import { Result } from "../result";
import { Failure } from "../failure";
import { globalConfigPath, localConfigPath } from "../consts";
import { ConfigData } from "./config.types";
import { Config } from "./config";
import ConfigDefaultData from "../../defaults/default.config.json";
import { ComponentLabel } from "../type.info";

export class ConfigLoader {
  public static validate(
    value: string | Object,
    type?: string
  ): Result<ConfigWarnings, InvalidConfigError> {
    const config: ConfigData =
      typeof value === "string" ? JSON.parse(value) : value;
    const issues: ConfigIssues = {};
    const warnings: ConfigWarnings = {};

    const missingSourceDirname =
      typeof config.compilation.source_dirname !== "string";

    if (missingSourceDirname) {
      issues.missingSourceDirname = true;
    }

    if (type) {
      const missingPathStructure =
        typeof config.components?.[type].path_pattern !== "string";

      if (missingPathStructure) {
        issues.missingPathStructure = true;
      }
    }

    return Object.keys(issues).length === 0
      ? Result.withContent(warnings)
      : Result.withFailure(
          Failure.fromError(new InvalidConfigError(issues, warnings))
        );
  }

  public static load(type?: ComponentLabel): Result<Config> {
    if (existsSync(localConfigPath)) {
      const content = readFileSync(localConfigPath, "utf-8");
      const props = JSON.parse(content);
      const { failure } = ConfigLoader.validate(props, type);
      return failure
        ? Result.withFailure(failure)
        : Result.withContent(Config.create(props));
    }
    console.warn(`Local config file not found.`);

    if (existsSync(globalConfigPath)) {
      const content = readFileSync(globalConfigPath, "utf-8");
      const props = JSON.parse(content);
      const { failure } = ConfigLoader.validate(props, type);
      return failure
        ? Result.withFailure(failure)
        : Result.withContent(Config.create(props));
    }

    return Result.withContent(Config.create(ConfigDefaultData));
  }
}
