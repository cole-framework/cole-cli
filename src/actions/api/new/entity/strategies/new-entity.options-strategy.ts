import chalk from "chalk";
import { Strategy } from "../../../../../core/strategy";
import { EntityJson, NewEntityOptions } from "../types";
import { ApiJsonParser } from "../../api-json.parser";
import { LangLoader } from "../../../../../core";
import { ApiData } from "../../api.types";

export class NewEntityOptionsStrategy extends Strategy {
  public async apply(apiSchema: ApiData, options: NewEntityOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name, withModel: has_model, props } = options;
    const entity: EntityJson = {
      name,
      endpoint,
      has_model,
      props,
    };
    const result = new ApiJsonParser(apiSchema.config, config, texts).build({
      entities: [entity],
    });

    console.log("->", JSON.stringify(result, null, 2));

    return result;
  }
}
