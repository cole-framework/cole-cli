import {
  Config,
  PluginConfigService,
  PluginMapService,
  ProjectConfigService,
  TextsService,
} from "../../../core";
import { newController } from "./new-controller";
import { newEntity } from "./new-entity";
import { newMapper } from "./new-mapper";
import { newModel } from "./new-model";
import { newRepository } from "./new-repository";
import { newRoute } from "./new-route";
import { newSource } from "./new-source";
import { newToolset } from "./new-toolset";
import { newUseCase } from "./new-use-case";
import chalk from "chalk";
import { CliConfigService } from "../../../core/config/tools/cli.config.service";
import { fromJson } from "./new-from-json";

export * from "./new-controller";
export * from "./new-entity";
export * from "./new-from-json";
export * from "./new-mapper";
export * from "./new-model";
export * from "./new-repository";
export * from "./new-route";
export * from "./new-source";
export * from "./new-toolset";
export * from "./new-use-case";
export * from "./new-router";
export * from "./new-launcher";
export * from "./new-container";

import RootConfig from "../../../defaults/root.config.json";
import { Texts } from "@cole-framework/cole-cli-core";

export const newComponent = async (options: any, type?: string) => {
  const texts = Texts.load();
  const cliConfig = await new CliConfigService().sync();

  const { content: projectConfig, failure } = await new ProjectConfigService(
    RootConfig.local_project_config_path
  ).get();

  if (failure) {
    console.log(
      chalk.yellow(texts.get("no_config_found___init_or_new_project_first"))
    );
    process.exit(0);
  }

  const pluginConfigService = new PluginConfigService(
    RootConfig.local_plugin_config_path
  );

  const { content: pluginConfig } = await pluginConfigService.getLocal();

  const pluginMapService = new PluginMapService(
    RootConfig.plugin_map_url,
    RootConfig.local_plugin_map_path
  );

  const pluginMap = await pluginMapService.sync();

  const config = Config.create(cliConfig, pluginConfig, projectConfig, options);
  const cliPluginPackageName = pluginMap.getLanguage(
    config.code.alias
  ).cli_plugin;

  switch (type) {
    case "controller":
      return newController(options, config, cliPluginPackageName);
    case "entity":
      return newEntity(options, config, cliPluginPackageName);
    case "mapper":
      return newMapper(options, config, cliPluginPackageName);
    case "model":
      return newModel(options, config, cliPluginPackageName);
    case "repository":
      return newRepository(options, config, cliPluginPackageName);
    case "route":
      return newRoute(options, config, cliPluginPackageName);
    case "source":
      return newSource(options, config, cliPluginPackageName);
    case "toolset":
      return newToolset(options, config, cliPluginPackageName);
    case "use-case":
      return newUseCase(options, config, cliPluginPackageName);
    default:
      return fromJson(options, config, cliPluginPackageName);
  }
};
