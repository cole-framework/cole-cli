import { Config } from "../../../../core";
import { ProjectConfig } from "../../common";
import { NewRepositoryInteractiveStrategy } from "./new-repository.interactive-strategy";
import { NewRepositoryOptionsStrategy } from "./new-repository.options-strategy";
import { NewRepositoryOptions } from "./types";

export const newRepository = async (
  options: NewRepositoryOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewRepositoryOptionsStrategy(config, projectConfig).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewRepositoryInteractiveStrategy(config, projectConfig).apply(
      cliPluginPackageName
    );
  }
};
