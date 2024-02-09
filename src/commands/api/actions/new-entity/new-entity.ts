import { NewEntityOptions } from "./types";
import { NewEntityOptionsStrategy } from "./new-entity.options-strategy";
import { NewEntityInteractiveStrategy } from "./new-entity.interactive-strategy";
import { ProjectConfig } from "../../common/project.config";
import { Config } from "../../../../core";

export const newEntity = async (
  options: NewEntityOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewEntityOptionsStrategy(config, projectConfig).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewEntityInteractiveStrategy(config, projectConfig).apply(
      cliPluginPackageName
    );
  }
};
