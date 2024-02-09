import chalk from "chalk";
import {
  LanguageStrategyProvider,
  PluginMap,
  ProjectDescription,
  Strategy,
  Texts,
} from "@cole-framework/cole-cli-core";
import { NewProjectOptions } from "./types";
import { CliOptionsTools } from "../../../../core";

export class NewProjectOptionsStrategy extends Strategy {
  constructor(private pluginMap: PluginMap) {
    super();
  }

  public async apply(options: NewProjectOptions) {
    const { pluginMap } = this;
    const texts = Texts.load();
    const description: ProjectDescription = {
      name: "",
      database: ["cache"],
      language: "",
      source: "",
    };
    let failed = false;

    if (!options.name) {
      failed = true;
      console.log(chalk.red(texts.get("missing_project_name")));
    } else {
      description.name = options.name;
    }

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
      .createProjectBuildStrategy(texts, pluginMap)
      .apply(description);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
