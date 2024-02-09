import {
  LanguageStrategyProvider,
  PluginMap,
  Strategy,
  Texts,
} from "@cole-framework/cole-cli-core";
import { NewProjectStoryboard } from "./new-project.storyboard";

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

    const languageModule: LanguageStrategyProvider = require(
      this.pluginMap.getLanguage(content.language.toLowerCase()).cli_plugin
    );

    if (!languageModule) {
      throw Error(
        `not_supported_language_###`.replace("###", content.language)
      );
    }

    const result = await languageModule
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
