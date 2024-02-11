import {
  LanguageStrategyProvider,
  PluginMap,
  Strategy,
  Texts,
} from "@cole-framework/cole-cli-core";
import { NewProjectStoryboard } from "./new-project.storyboard";
import { PluginConfigService } from "../../../api";

import RootConfig from "../../../../defaults/root.config.json";

export class NewProjectInteractiveStrategy extends Strategy {
  constructor(private pluginMap: PluginMap) {
    super();
  }

  public readonly name = "new_project";
  public async apply() {
    const { pluginMap } = this;

    const texts = Texts.load();
    const newProjectStoryboard = new NewProjectStoryboard(texts, pluginMap);
    const { content, failure } = await newProjectStoryboard.run();

    if (failure) {
      console.log(failure.error);
      process.exit(1);
    }
    const languagePlugin = pluginMap.getLanguage(
      content.language.toLowerCase()
    );

    if (!languagePlugin) {
      throw Error(
        `not_supported_language_###`.replace("###", content.language)
      );
    }

    const languageStrategies: LanguageStrategyProvider = require(
      languagePlugin.cli_plugin
    );

    await new PluginConfigService(RootConfig.local_plugin_config_path).sync(
      languagePlugin.cli_plugin_config_url
    );

    const result = await languageStrategies
      .createProjectBuildStrategy(texts, pluginMap)
      .apply(content);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
