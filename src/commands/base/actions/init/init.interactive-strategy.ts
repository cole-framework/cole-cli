import { PluginConfigService } from "./../../../../core/plugin-config.service";
import { InitStoryboard } from "./init.storyboard";
import {
  LanguageStrategyProvider,
  PluginMap,
  Strategy,
  Texts,
} from "@cole-framework/cole-cli-core";
import Config from "../../../../defaults/config.json";

export class InitInteractiveStrategy extends Strategy {
  constructor(private pluginMap: PluginMap) {
    super();
  }

  public readonly name = "new_project";
  public async apply() {
    const texts = Texts.load();
    const { pluginMap } = this;

    const newProjectStoryboard = new InitStoryboard(texts, pluginMap);
    const { content, failure } = await newProjectStoryboard.run();

    if (failure) {
      console.log(failure.error);
      process.exit(1);
    }
    const langConfig = this.pluginMap.getLanguage(content.language);
    const languageModule: LanguageStrategyProvider = require(
      langConfig.cli_plugin
    );

    if (!languageModule) {
      throw Error(
        `not_supported_language_###`.replace("###", content.language)
      );
    }

    const result = await languageModule
      .createProjectInitStrategy(texts, pluginMap)
      .apply(content);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
