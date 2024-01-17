import { existsSync, mkdirSync, writeFileSync } from "fs";
import {
  globalConfigPath,
  globalTemplatesPath,
  localConfigPath,
  localMapPath,
  localTemplatesPath,
} from "../../../core/consts";
import DefaultConfig from "../../../defaults/default.config.json";
import { fetchData } from "../../../core/tools/files.tools";
import { dirname, join } from "path";
import { InitOptions } from "./types";

import { ConfigData, ConfigLoader, InteractionPrompts } from "../../../core";

export const init = async (options: InitOptions) => {
  const { global } = options;
  /* CONFIG */
  const configPath = global ? globalConfigPath : localConfigPath;
  if (existsSync(configPath)) {
    const shouldContinue = await InteractionPrompts.continue(
      `A configuration file has been detected in the specified path. Do you want to overwrite it?`
    );

    if (shouldContinue === false) {
      process.exit(0);
    }
  } else {
    mkdirSync(dirname(configPath), { recursive: true });
  }

  const configData = options.path
    ? await fetchData<ConfigData>(options.path)
    : DefaultConfig;

  const { failure } = ConfigLoader.validate(configData);

  if (failure) {
    return failure.error;
  }

  writeFileSync(configPath, JSON.stringify(configData, null, 2));

  /* FILE MAP */
  if (global === false && existsSync(localMapPath) === false) {
    writeFileSync(localMapPath, "{}");
  }

  /* TEMPLATES */
  const templatesPath = global ? globalTemplatesPath : localTemplatesPath;

  if (existsSync(templatesPath)) {
    const shouldContinue = await InteractionPrompts.continue(
      `Template files have been detected in the specified path. Do you want to overwrite them?`
    );

    if (shouldContinue === false) {
      process.exit(0);
    }
  } else {
    mkdirSync(dirname(templatesPath), { recursive: true });
  }

  // for (const template of DefaultTemplates) {
  //   const path = configData.components[template.name]?.templatePath;
  //   const templatePath = path
  //     ? join(templatesPath, path)
  //     : join(templatesPath, template.filename);

  //   writeFileSync(templatePath, template.content);
  // }
};
