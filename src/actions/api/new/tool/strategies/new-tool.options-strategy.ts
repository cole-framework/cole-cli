import chalk from "chalk";
import { Strategy } from "../../../../../core/strategy";
import { ToolJson, NewToolOptions } from "../types";
import { ApiJsonParser } from "../../api-json.parser";
import { LangLoader } from "../../../../../core";
import { ApiData } from "../../api.types";

export class NewToolOptionsStrategy extends Strategy {
  public async apply(apiSchema: ApiData, options: NewToolOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name } = options;
    const tool: ToolJson = {
      name,
      endpoint,
    };
    const result = new ApiJsonParser(apiSchema.config, config, texts).build({
      tools: [tool],
    });

    console.log("->", JSON.stringify(result, null, 2));

    return result;
  }
}
