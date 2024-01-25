import chalk from "chalk";
import { CliOptionsTools, Texts } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { SourceJson, NewSourceOptions } from "./types";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ApiConfig, ApiGenerator } from "../../common";

export class NewSourceOptionsStrategy extends Strategy {
  public async apply(apiConfig: ApiConfig, options: NewSourceOptions) {
    const { config } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.source.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }

    const { endpoint, name, model, table } = options;
    const storages = CliOptionsTools.splitArrayOption(options.storage);
    const source: SourceJson = {
      name,
      endpoint,
      table,
      storages,
      model,
    };
    const schema = new ApiJsonParser(apiConfig, config, texts).build({
      models: [],
      entities: [],
      sources: [source],
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
