import path from "path";
import { Config, ConfigAddons, ConfigTools, ReservedType } from "../../config";
import { SchemaTools } from "../schema.tools";

export type ImportData = {
  dflt?: string;
  path?: string;
  ref_path?: string;
  list?: string[];
  alias?: string;
};

export type ImportObject = {
  dflt: string;
  path: string;
  list: string[];
  alias: string;
};

export type ImportJson = {
  dflt?: string;
  path?: string;
  list?: string[];
  alias?: string;
  ref_path?: string;
};

export type ImportConfig = ImportJson & ConfigAddons;

export const IMPORT_REGEX =
  /^(import)?\s*(\w+)?(\s*[,]?\s*\{\s*([a-zA-Z, ]+)\s*\})?(\s*\*\s+as\s+(\w+))?\s+from\s+["']([a-zA-Z0-9\/\\\._]+)["'];?$/;

export class ImportTools {
  static stringToData(str: string): ImportData {
    let dflt;
    let path;
    let alias;
    let list = [];

    const match = str.match(IMPORT_REGEX);

    if (match) {
      dflt = match[2];
      alias = match[6];
      path = match[7];

      if (match[4]) {
        list.push(...match[4].split(/,\s*/));
      }
    }

    return {
      dflt,
      path,
      alias,
      list,
    };
  }
  static createRelativeImportPath(
    componentPath: string,
    dependencyPath: string
  ) {
    const relativePath = path.relative(
      path.dirname(componentPath),
      dependencyPath
    );

    if (!relativePath.startsWith(".") && !relativePath.startsWith("..")) {
      return "./" + relativePath;
    }
    return relativePath;
  }
}

export class ImportSchema {
  public static create(
    data: string | ImportData | ImportJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    let dflt;
    let path;
    let alias;
    let list = [];

    if (typeof data === "string") {
      const match = ImportTools.stringToData(data);

      if (ConfigTools.hasInstructions(match.dflt)) {
        dflt = ConfigTools.executeInstructions(
          match.dflt,
          references,
          config
        );
      } else {
        dflt = match.dflt;
      }

      if (ConfigTools.hasInstructions(match.alias)) {
        alias = ConfigTools.executeInstructions(
          match.alias,
          references,
          config
        );
      } else {
        alias = match.alias;
      }

      if (ConfigTools.hasInstructions(match.path)) {
        path = ConfigTools.executeInstructions(
          match.path,
          references,
          config
        );
      } else {
        path = match.path;
      }
      if (Array.isArray(match.list)) {
        match.list.forEach((l) => {
          if (ConfigTools.hasInstructions(l)) {
            list.push(ConfigTools.executeInstructions(l, references, config));
          } else {
            list.push(l);
          }
        });
      }
    } else {
      if (ConfigTools.hasInstructions(data.dflt)) {
        dflt = ConfigTools.executeInstructions(data.dflt, references, config);
      } else {
        dflt = data.dflt;
      }

      if (ConfigTools.hasInstructions(data.alias)) {
        alias = ConfigTools.executeInstructions(
          data.alias,
          references,
          config
        );
      } else {
        alias = data.alias;
      }

      let tempPath: string;

      if (ConfigTools.hasInstructions(data.path)) {
        tempPath = ConfigTools.executeInstructions(
          data.path,
          references,
          config
        );
      } else {
        tempPath = data.path;
      }

      if (tempPath.includes("@") === false && tempPath.includes("/")) {
        path = ImportTools.createRelativeImportPath(data.ref_path, tempPath);
      } else {
        path = tempPath;
      }
      if (Array.isArray(data.list)) {
        data.list.forEach((l) => {
          if (ConfigTools.hasInstructions(l)) {
            list.push(ConfigTools.executeInstructions(l, references, config));
          } else {
            list.push(l);
          }
        });
      }
    }

    return new ImportSchema(dflt, path, list, alias);
  }

  constructor(
    public readonly dflt: string,
    public readonly path: string,
    public readonly list: string[],
    public readonly alias: string
  ) {}

  toObject(): ImportObject {
    const { dflt, path, list, alias } = this;

    return {
      dflt,
      path,
      alias,
      list,
    };
  }
}
