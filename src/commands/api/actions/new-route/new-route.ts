import { NewRouteOptions } from "./types";
import { ProjectConfig } from "../../common";
import { NewRouteOptionsStrategy } from "./new-route.options-strategy";
import { NewRouteInteractiveStrategy } from "./new-route.interactive-strategy";
import { Config } from "../../../../core";

export const newRoute = async (
  options: NewRouteOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewRouteOptionsStrategy(config, projectConfig).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewRouteInteractiveStrategy(config, projectConfig).apply(
      cliPluginPackageName
    );
  }
};
