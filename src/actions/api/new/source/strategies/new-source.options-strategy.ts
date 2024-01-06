import chalk from "chalk";
import { CliOptionsTools, LangLoader, ModelType } from "../../../../../core";
import { ApiDataCreationStrategy } from "../../api-data.strategy";
import { SourceJson, NewSourceOptions } from "../types";
import { ApiJsonParser } from "../../api-json.parser";
import { ApiData } from "../../api.types";

export class NewSourceOptionsStrategy extends ApiDataCreationStrategy {
  public async apply(apiSchema: ApiData, options: NewSourceOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (!options.endpoint && config.components.source.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name, model, table } = options;
    const extractedTypes = CliOptionsTools.splitArrayOption(options.type);
    const types: string[] =
      extractedTypes.size > 0 ? [...extractedTypes] : ["json"];

    const source: SourceJson = {
      name,
      endpoint,
      table,
      storages: types,
      model,
    };

    const result = new ApiJsonParser(apiSchema.config, config, texts).build({
      sources: [source],
    });

    console.log("->", JSON.stringify(result, null, 2));

    return result;
  }
}
