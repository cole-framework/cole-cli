import { localConfigPath, globalConfigPath } from "../consts";

export type ConfigIssues = {
  missingSourceDirname?: boolean;
  missingPathStructure?: boolean;
};

export type ConfigWarnings = {
  missingEndpoint?: boolean;
  missingMarker?: boolean;
};

export const ERROR_MESSAGES = {
  missingSourceDirname: `The name of the root directory containing the source code has not been set.`,
  missingPathStructure: `TThe configuration does not contain a path pattern for the component.`,
  missingEndpoint: `Endpoint not specified even though path pattern requires it.`,
  missingMarker: `Marker not found in path pattern and overwrite option is false. This will overwrite the contents of the file instead of updating it.`,
};

export class InvalidConfigError extends Error {
  public messages = ERROR_MESSAGES;
  constructor(
    public readonly issues: ConfigIssues = {},
    public readonly warnings: ConfigWarnings = {}
  ) {
    super(
      `No valid configuration detected. Set config before you start creating components.`
    );
  }
}

export class InvalidConfigPathError extends Error {
  constructor(global: boolean) {
    super(
      `No local or global configuration file found. ${
        global ? globalConfigPath : localConfigPath
      }`
    );
  }
}
