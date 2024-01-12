import { ConfigAddons } from "../../config";
import { SchemaTools } from "../schema.tools";

export type ImportData = {
  dflt?: string;
  path?: string;
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
}

export class ImportSchema {
  public static create(data: string | ImportData | ImportJson) {
    let dflt;
    let path;
    let alias;
    let list = [];

    if (typeof data === "string") {
      const match = ImportTools.stringToData(data);
      dflt = match.dflt;
      alias = match.alias;
      list = match.list;
      path = match.path;
    } else {
      dflt = data.dflt;
      alias = data.alias;
      list = [...data.list];
      path = data.path;
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
