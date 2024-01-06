import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { LangLoader } from "../../../../../core";
import { ApiDataCreationStrategy } from "../../api-data.strategy";
import { ApiJsonParser } from "../../api-json.parser";
import { ApiData } from "../../api.types";

export class NewRouteJsonStrategy extends ApiDataCreationStrategy {
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
      const json = JSON.parse(data);
      const result = new ApiJsonParser(apiSchema.config, config, texts).build(
        json
      );

      console.log("->", JSON.stringify(result, null, 2));

      return result;
    } catch (error) {
      console.log(chalk.red(error.message));
      process.exit(1);
    }
  }
}
