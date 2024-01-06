import { existsSync, readFileSync } from "fs";
import { ApiDataCreationStrategy } from "../../api-data.strategy";
import chalk from "chalk";
import { NewMapperJson } from "../types";
import { ApiJsonParser } from "../../api-json.parser";
import { LangLoader } from "../../../../../core";
import { ApiData } from "../../api.types";

export class NewMapperJsonStrategy extends ApiDataCreationStrategy {
  public async apply(apiSchema: ApiData, jsonPath: string) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (existsSync(jsonPath) === false) {
      console.log(
        chalk.red(texts.INFO_FILE_XXX_NOT_FOUND.replace("###", jsonPath))
      );
      process.exit(1);
    }

    try {
      const data = readFileSync(jsonPath, "utf-8");
      const json: NewMapperJson = JSON.parse(data);
      const result = new ApiJsonParser(apiSchema.config, config, texts).build(
        json
      );

      console.log("->", JSON.stringify(result, null, 2));

      return result;
    } catch (error) {
      console.log(chalk.red(error));
      process.exit(1);
    }
  }
}
