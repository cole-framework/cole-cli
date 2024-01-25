import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import {
  globalConfigPath,
  localConfigPath,
  fetchData,
  ConfigData,
} from "../../../core";
import { InteractionPrompts } from "../../api/common/interactions";
import { isValidConfigKey, setConfigValue } from "../common";
import { SetConfigOptions } from "./set-config.types";

import DefaultConfig from "../../../defaults/default.config.json";

export const setConfig = async (options: SetConfigOptions) => {
  const { key, value, global } = options;
  const configPath = global ? globalConfigPath : localConfigPath;
  const configExists = existsSync(configPath);
  let configData;

  if (configExists === false) {
    mkdirSync(dirname(configPath), { recursive: true });
  }

  if (key && value) {
    if (configExists) {
      configData = JSON.parse(readFileSync(configPath, "utf-8"));
    } else {
      configData = DefaultConfig;
    }

    if (isValidConfigKey(configData, key)) {
      setConfigValue(configData, key, value);
    }
  } else if (options.path) {
    if (configExists) {
      const shouldContinue = await InteractionPrompts.continue(
        `Configuration file detected. Do you want to overwrite?`
      );

      if (shouldContinue === false) {
        process.exit(0);
      }
    }

    configData = await fetchData<ConfigData>(options.path);
  } else if (options.default) {
    if (configExists) {
      const shouldContinue = await InteractionPrompts.continue(
        `Configuration file detected. Do you want to overwrite?`
      );

      if (shouldContinue === false) {
        process.exit(0);
      }
    }
    configData = DefaultConfig;
  } else {
    return;
  }

  writeFileSync(configPath, JSON.stringify(configData, null, 2));
};
