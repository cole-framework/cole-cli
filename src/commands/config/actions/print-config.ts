import { existsSync, readFileSync } from "fs";
import { PrintConfigOptions } from "./print-config.types";
import { getConfigValue } from "../common/config.tools";
import { globalConfigPath, localConfigPath } from "../../../core";

export const printConfig = (options: PrintConfigOptions) => {
  const { key, global } = options;
  const targetPath = global ? globalConfigPath : localConfigPath;

  const storedConfig = existsSync(targetPath)
    ? readFileSync(targetPath, "utf-8")
    : null;

  if (storedConfig && key) {
    console.log(`{ ${key}: ${getConfigValue(JSON.parse(storedConfig), key)} }`);
  } else if (storedConfig) {
    console.dir(storedConfig, { depth: null });
  } else {
    console.log("");
  }
};
