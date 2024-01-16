import chalk from "chalk";
import { Strategy } from "../../../../../core/strategy";
import { UseCaseJson, NewUseCaseOptions } from "../types";
import { ApiJsonParser } from "../../api-json.parser";
import { LangLoader } from "../../../../../core";
import { ApiData } from "../../api.types";

export class NewUseCaseOptionsStrategy extends Strategy {
  public async apply(apiSchema: ApiData, options: NewUseCaseOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (!options.endpoint && config.components.useCase.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name, input, output } = options;
    const use_case: UseCaseJson = {
      name,
      endpoint,
      input,
      output,
    };

    const result = new ApiJsonParser(apiSchema.config, config, texts).build({
      use_cases: [use_case],
    });

    console.log("->", JSON.stringify(result, null, 2));

    return result;
  }
}
