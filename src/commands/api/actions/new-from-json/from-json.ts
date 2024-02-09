import chalk from "chalk";
import { ConfigLoader, Texts } from "../../../../core";
import { DefaultCliOptions } from "../../common/api.types";
import { existsSync, readFileSync } from "fs";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ApiGenerator } from "../../common/api-generator";
import { ProjectConfig } from "../../common/project.config";

export const fromJson = async (options: DefaultCliOptions) => {
  const { content: config, failure } = ConfigLoader.load();

  if (failure) {
    console.log(chalk.red(failure.error));
    process.exit(1);
  }

  const projectConfig = ProjectConfig.create(options, config);
  const texts = await Texts.load();

  if (existsSync(options.json) === false) {
    console.log(
      chalk.red(
        texts.get("json_file_###_not_found").replace("###", options.json)
      )
    );
    process.exit(1);
  }

  try {
    const data = readFileSync(options.json, "utf-8");
    const json = JSON.parse(data);
    const schema = new ApiJsonParser(config, texts).build(json);
    const apiGenerator = new ApiGenerator(config);
    const result = await apiGenerator.generate(schema);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
