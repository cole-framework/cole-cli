import { Config } from "../../../../core";
import { ProjectConfig } from "../../common";
import { NewUseCaseInteractiveStrategy } from "./new-use-case.interactive-strategy";
import { NewUseCaseOptionsStrategy } from "./new-use-case.options-strategy";
import { NewUseCaseOptions } from "./types";

export const newUseCase = async (
  options: NewUseCaseOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewUseCaseOptionsStrategy(config, projectConfig).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewUseCaseInteractiveStrategy(config, projectConfig).apply(
      cliPluginPackageName
    );
  }
};
