import { NewModelOptions } from "./types";
import { NewModelInteractiveStrategy } from "./new-model.interactive-strategy";
import { NewModelOptionsStrategy } from "./new-model.options-strategy";
import { ProjectConfig } from "../../common";
import { Config } from "../../../../core";

export const newModel = async (
  options: NewModelOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewModelOptionsStrategy(config, projectConfig).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewModelInteractiveStrategy(config, projectConfig).apply(
      cliPluginPackageName
    );
  }
};
