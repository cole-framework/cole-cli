import chalk from "chalk";
import { CliOptionsTools, Result, Strategy, Texts } from "../../../core";
import { NewProjectOptions, ProjectDescription } from "./types";
import { TypeScriptProjectBuildStrategy } from "./build-strategies";

export class NewProjectOptionsStrategy extends Strategy {
  public async apply(options: NewProjectOptions) {
    const texts = Texts.load(true);
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

    let buildStrategy: Strategy<Promise<Result>>;

    if (["typescript", "ts"].includes(description.language.toLowerCase())) {
      buildStrategy = new TypeScriptProjectBuildStrategy(texts);
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
