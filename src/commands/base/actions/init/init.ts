import { dirname } from "path";
import { Texts } from "@cole-framework/cole-cli-core";
import { existsSync, mkdirSync } from "fs";
import { InitOptions } from "./types";
import { InitInteractiveStrategy } from "./init.interactive-strategy";
import { InitOptionsStrategy } from "./init.options-strategy";
import { InteractionPrompts } from "../../../api";
import { PluginMapService } from "../../../../core/plugin-map.service";
import Config from "../../../../defaults/config.json";
import { readdir, unlink } from "fs/promises";

export const init = async (options: InitOptions) => {
  const texts = Texts.load();
  const pluginConfigExists = existsSync(Config.local_plugin_config_path);

  if (!options.force && pluginConfigExists) {
    const shouldContinue = await InteractionPrompts.continue(
      texts.get("configuration_file_detected_do_you_want_to_overwrite_it")
    );

    if (shouldContinue === false) {
      process.exit(0);
    }
  } else if (pluginConfigExists === false) {
    mkdirSync(dirname(Config.local_plugin_config_path), { recursive: true });
  } else {
    try {
      const dir = dirname(Config.local_plugin_config_path);
      const files = await readdir(dir);
      const unlinkPromises = files.map((filename) =>
        unlink(`${dir}/${filename}`)
      );
      return Promise.all(unlinkPromises);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  const pluginMapService = new PluginMapService(
    Config.plugin_map_url,
    Config.local_plugin_map_path
  );

  const pluginMap = await pluginMapService.sync();

  if (Object.keys(options).length === 0) {
    new InitInteractiveStrategy(pluginMap).apply();
  } else {
    new InitOptionsStrategy(pluginMap).apply(options);
  }
};
