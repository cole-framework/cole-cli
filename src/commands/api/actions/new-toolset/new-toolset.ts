import { NewToolsetOptions } from "./types";
import { ProjectConfig } from "../../common";
import { NewToolsetOptionsStrategy } from "./new-toolset.options-strategy";
import { NewToolsetInteractiveStrategy } from "./new-toolset.interactive-strategy";
import { Config } from "../../../../core";

export const newToolset = async (
  options: NewToolsetOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewToolsetOptionsStrategy(config, projectConfig).apply(options, cliPluginPackageName);
  } else {
    new NewToolsetInteractiveStrategy(config, projectConfig).apply(cliPluginPackageName);
  }
};
