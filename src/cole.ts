#!/usr/bin/env node

import { Texts } from "@cole-framework/cole-cli-core";
import { runProgram } from "./cole.commands";
import { PluginMapService } from "./core/plugin-map.service";
import * as Config from "./defaults/config.json";

const start = async () => {
  const texts = Texts.load();
  const service: PluginMapService = new PluginMapService(
    Config.plugin_map_url,
    Config.local_plugin_map_path
  );

  const localPluginMap = await service.getLocal();

  if (!localPluginMap) {
  }

  const result = await service.fetch();

  runProgram(texts);
};

start();
