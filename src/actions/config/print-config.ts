import { existsSync, readFileSync } from "fs";
import { globalConfigPath, localConfigPath } from "../../core/consts";
import { GetConfigOptions } from "./config.types";
import { getConfigValue } from "./config.tools";

export const printConfig = (options: GetConfigOptions) => {
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
