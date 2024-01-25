import chalk from "chalk";
import { Strategy } from "../../../../core/strategy";
import { EntityJson, NewEntityOptions } from "./types";
import { ApiJsonParser } from "../../common/api-json.parser";
import { Texts } from "../../../../core";
import { ApiGenerator } from "../../common";
import { ApiConfig } from "../../common/api.config";

export class NewEntityOptionsStrategy extends Strategy {
  public async apply(apiConfig: ApiConfig, options: NewEntityOptions) {
    const { config } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }

    const { endpoint, name, model: has_model, props } = options;
    const entity: EntityJson = {
      name,
      endpoint,
      has_model,
      props,
    };
    const schema = new ApiJsonParser(apiConfig, config, texts).build({
      models: [],
      entities: [entity],
    });
    const result = await new ApiGenerator(config).generate(schema);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
