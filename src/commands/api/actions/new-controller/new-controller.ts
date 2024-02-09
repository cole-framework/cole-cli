import { NewControllerOptions } from "./types";
import { ProjectConfig } from "../../common";
import { NewControllerOptionsStrategy } from "./new-controller.options-strategy";
import { NewControllerInteractiveStrategy } from "./new-controller.interactive-strategy";
import { Config } from "../../../../core";

export const newController = async (
  options: NewControllerOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewControllerOptionsStrategy(config, projectConfig).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewControllerInteractiveStrategy(config, projectConfig).apply(
      cliPluginPackageName
    );
  }
};
