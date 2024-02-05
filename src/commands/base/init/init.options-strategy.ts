import chalk from "chalk";
import { CliOptionsTools, Result, Strategy, Texts } from "../../../core";
import { InitOptions } from "./types";
import { TypeScriptProjectInitStrategy } from "./init-strategies";
import { ProjectDescription } from "../new-project";

export class InitOptionsStrategy extends Strategy {
  public async apply(options: InitOptions) {
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

    let buildStrategy: Strategy<Promise<Result>>;

    if (["typescript", "ts"].includes(description.language.toLowerCase())) {
      buildStrategy = new TypeScriptProjectInitStrategy(texts);
    } else {
      throw Error(
        `not_supported_language_###`.replace("###", description.language)
      );
    }

    const result = await buildStrategy.apply(description);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
