import chalk from "chalk";
import { LangLoader, ModelType } from "../../../../../core";
import { ApiDataCreationStrategy } from "../../api-data.strategy";
import { ModelJson, NewModelOptions } from "../types";
import { CliOptionsTools } from "../../../../../core/tools";
import { ApiJsonParser } from "../../api-json.parser";
import { ApiData } from "../../api.types";

export class NewModelOptionsStrategy extends ApiDataCreationStrategy {
  public async apply(apiSchema: ApiData, options: NewModelOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name } = options;
    const extractedTypes = CliOptionsTools.splitArrayOption(options.type);
    const types: string[] =
      extractedTypes.size > 0 ? [...extractedTypes] : ["json"];
    const props = CliOptionsTools.splitArrayOption(options.props);

    const model: ModelJson = {
      name,
      endpoint,
      types,
      props: [...props],
    };

    const result = new ApiJsonParser(apiSchema.config, config, texts).build({
      models: [model],
    });

    console.log("->", JSON.stringify(result, null, 2));

    return result;
  }
}
