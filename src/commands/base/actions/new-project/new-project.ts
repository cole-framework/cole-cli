import { NewProjectOptions } from "./types";
import { NewProjectInteractiveStrategy } from "./new-project.interactive-strategy";
import { NewProjectOptionsStrategy } from "./new-project.options-strategy";
import { PluginMapService } from "../../../../core/config/tools/plugin-map.service";
import Config from "../../../../defaults/root.config.json";

export const newProject = async (options: NewProjectOptions) => {
  const pluginMapService = new PluginMapService(
    Config.plugin_map_url,
    Config.local_plugin_map_path
  );

  const pluginMap = await pluginMapService.sync();

  if (Object.keys(options).length === 0) {
    new NewProjectInteractiveStrategy(pluginMap).apply();
  } else {
    new NewProjectOptionsStrategy(pluginMap).apply(options);
  }
};
