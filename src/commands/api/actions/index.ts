import { Config, PluginConfigService, PluginMapService } from "../../../core";
import { newController } from "./new-controller";
import { newEntity } from "./new-entity";
import { newMapper } from "./new-mapper";
import { newModel } from "./new-model";
import { newRepository } from "./new-repository";
import { newRoute } from "./new-route";
import { newSource } from "./new-source";
import { newToolset } from "./new-toolset";
import { newUseCase } from "./new-use-case";
import { Texts } from "@cole-framework/cole-cli-core";
import chalk from "chalk";
import { CliConfigService } from "../../../core/cli-config.service";

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

export const newComponent = async (type: string, options: any) => {
  const texts = Texts.load();
  const cliConfig = await new CliConfigService().sync();

  const pluginConfigService = new PluginConfigService(
    cliConfig.local_plugin_config_path
  );
  const { content: pluginConfig, failure } =
    await pluginConfigService.getLocal();

  if (failure) {
    console.log(
      chalk.yellow(texts.get("no_config_found___init_or_new_project_first"))
    );
    process.exit(0);
  }

  const pluginMapService = new PluginMapService(
    cliConfig.plugin_map_url,
    cliConfig.local_plugin_map_path
  );

  const pluginMap = await pluginMapService.sync();

  const config = Config.create(cliConfig, pluginConfig, options);
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
      throw Error(`Unknown component type: ${type}`);
  }
};
