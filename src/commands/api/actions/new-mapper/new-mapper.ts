import { Config } from "../../../../core";
import { ProjectConfig } from "../../common";
import { NewMapperInteractiveStrategy } from "./new-mapper.interactive-strategy";
import { NewMapperOptionsStrategy } from "./new-mapper.options-strategy";
import { NewMapperOptions } from "./types";

export const newMapper = async (
  options: NewMapperOptions,
  config: Config,
  projectConfig: ProjectConfig,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewMapperOptionsStrategy(config, projectConfig).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewMapperInteractiveStrategy(config, projectConfig).apply(
      cliPluginPackageName
    );
  }
};
