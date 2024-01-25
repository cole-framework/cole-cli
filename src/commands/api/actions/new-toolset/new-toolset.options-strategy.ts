import chalk from "chalk";
import { Strategy } from "../../../../core/strategy";
import { ToolsetJson, NewToolsetOptions } from "./types";
import { ApiJsonParser } from "../../common/api-json.parser";
import { CliOptionsTools, MethodJson, Texts } from "../../../../core";
import { ApiConfig, ApiGenerator } from "../../common";

export class NewToolsetOptionsStrategy extends Strategy {
  public async apply(apiConfig: ApiConfig, options: NewToolsetOptions) {
    const { config } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }

    if (!options.layer) {
      console.log(chalk.red(texts.get("missing_layer")));
      process.exit(1);
    }

    const { endpoint, name, layer } = options;
    const methods = CliOptionsTools.splitArrayOption(options.methods);
    const toolset: ToolsetJson = {
      layer,
      name,
      endpoint,
      methods,
    };
    const schema = new ApiJsonParser(apiConfig, config, texts).build({
      models: [],
      entities: [],
      toolsets: [toolset],
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
