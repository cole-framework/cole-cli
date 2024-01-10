import chalk from "chalk";
import { ConfigLoader, LangLoader, WriteMethod } from "../../../../core";
import { ApiData, DefaultCliOptions } from "../api.types";
import { existsSync, readFileSync } from "fs";
import { ApiJsonParser } from "../api-json.parser";

export const fromJson = async (options: DefaultCliOptions) => {
  const { content: config, failure } = ConfigLoader.load();

  if (failure) {
    console.log(chalk.red(failure.error));
    process.exit(1);
  }

  const schema: ApiData = {
    config: {
      skip_tests:
        options.skipTests === undefined
          ? config.general.skipTests
          : options.skipTests,
      with_dependencies:
        options.withDeps === undefined
          ? config.general.withDependencies
          : options.withDeps,
      use_cwd: false,
      force: options.force,
      write_method: options.force ? WriteMethod.Overwrite : WriteMethod.Write,
    },
    components: [],
  };

  const { content: texts } = await LangLoader.load();

  if (existsSync(options.json) === false) {
    console.log(
      chalk.red(texts.INFO_FILE_XXX_NOT_FOUND.replace("###", options.json))
    );
    process.exit(1);
  }

  try {
    const data = readFileSync(options.json, "utf-8");
    const json = JSON.parse(data);
    const result = new ApiJsonParser(schema.config, config, texts).build(json);

    console.log("->", JSON.stringify(result, null, 2));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};