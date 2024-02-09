import chalk from "chalk";
import { InitOptions } from "./types";
import {
  LanguageStrategyProvider,
  PluginMap,
  ProjectDescription,
  Strategy,
  Texts,
} from "@cole-framework/cole-cli-core";
import { CliOptionsTools } from "../../../../core";

export class InitOptionsStrategy extends Strategy {
  constructor(private pluginMap: PluginMap) {
    super();
  }

  public async apply(options: InitOptions) {
    const { pluginMap } = this;
    const texts = await Texts.load();
    const description: ProjectDescription = {
      name: "",
      database: ["cache"],
      language: "",
      source: "",
    };
    let failed = false;

    if (!options.lang) {
      failed = true;
      console.log(chalk.red(texts.get("missing_project_language")));
    } else {
      description.language = options.lang;
    }

    if (!options.source) {
      failed = true;
      console.log(chalk.red(texts.get("missing_project_source_path")));
    } else {
      description.source = options.source;
    }

    if (failed) {
      process.exit(1);
    }

    CliOptionsTools.splitArrayOption(options.database).forEach((db) => {
      if (description.database.includes(db) === false) {
        description.database.push(db);
      }
    });

    const languageModule: LanguageStrategyProvider = require(
      this.pluginMap.getLanguage(description.language.toLowerCase()).cli_plugin
    );

    if (!languageModule) {
      throw Error(
        `not_supported_language_###`.replace("###", description.language)
      );
    }

    const result = await languageModule
      .createProjectInitStrategy(texts, pluginMap)
      .apply(description);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
