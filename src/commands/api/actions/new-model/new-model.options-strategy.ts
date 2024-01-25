import { Texts } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { ModelJson, NewModelOptions } from "./types";
import { CliOptionsTools } from "../../../../core/tools";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ApiGenerator } from "../../common/api-generator";
import { ApiConfig } from "../../common";

export class NewModelOptionsStrategy extends Strategy {
  public readonly name = "new_model_options_strategy";

  public async apply(apiConfig: ApiConfig, options: NewModelOptions) {
    const { config } = this;
    const texts = await Texts.load();

    const { endpoint, name } = options;
    const extractedTypes = CliOptionsTools.splitArrayOption(options.type);
    const types: string[] =
      extractedTypes.length > 0 ? extractedTypes : ["json"];
    const props = CliOptionsTools.splitArrayOption(options.props);

    const model: ModelJson = {
      name,
      endpoint,
      types,
      props,
    };

    const schema = new ApiJsonParser(apiConfig, config, texts).build({
      models: [model],
    });
    const apiGenerator = new ApiGenerator(config);
    const result = await apiGenerator.generate(schema);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
