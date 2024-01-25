import chalk from "chalk";
import { Strategy } from "../../../../core/strategy";
import { MapperJson, NewMapperOptions } from "./types";
import { CliOptionsTools, Texts } from "../../../../core";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ApiConfig, ApiGenerator } from "../../common";

export class NewMapperOptionsStrategy extends Strategy {
  public async apply(apiConfig: ApiConfig, options: NewMapperOptions) {
    const { config } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }

    const { endpoint, name, entity, model } = options;
    const storages = CliOptionsTools.splitArrayOption(options.storage);
    const mapper: MapperJson = {
      name,
      endpoint,
      storages,
      model,
      entity,
    };

    const schema = new ApiJsonParser(apiConfig, config, texts).build({
      entities: [],
      models: [],
      mappers: [mapper],
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
