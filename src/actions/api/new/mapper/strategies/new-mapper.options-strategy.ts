import chalk from "chalk";
import { ApiDataCreationStrategy } from "../../api-data.strategy";
import { MapperJson, NewMapperOptions } from "../types";
import { CliOptionsTools, LangLoader } from "../../../../../core";
import { ApiJsonParser } from "../../api-json.parser";
import { ApiData } from "../../api.types";

export class NewMapperOptionsStrategy extends ApiDataCreationStrategy {
  public async apply(apiSchema: ApiData, options: NewMapperOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name, entity, model } = options;
    const storages = CliOptionsTools.splitArrayOption(options.storage);
    const mapper: MapperJson = {
      name,
      endpoint,
      storages: [...storages],
      model,
      entity,
    };

    const result = new ApiJsonParser(apiSchema.config, config, texts).build({
      mappers: [mapper],
    });

    console.log("->", JSON.stringify(result, null, 2));

    return result;
  }
}
