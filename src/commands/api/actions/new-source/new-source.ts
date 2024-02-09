import { Config } from "../../../../core";
import { ProjectConfig } from "../../common";
import { NewSourceInteractiveStrategy } from "./new-source.interactive-strategy";
import { NewSourceOptionsStrategy } from "./new-source.options-strategy";
import { NewSourceOptions } from "./types";

export const newSource = async (
  options: NewSourceOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewSourceOptionsStrategy(config, projectConfig).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewSourceInteractiveStrategy(config, projectConfig).apply(
      cliPluginPackageName
    );
  }
};
