import chalk from "chalk";
import { Strategy } from "../../../../core/strategy";
import { UseCaseJson, NewUseCaseOptions } from "./types";
import { ApiJsonParser } from "../../common/api-json.parser";
import { CliOptionsTools, Texts } from "../../../../core";
import { ApiConfig, ApiGenerator } from "../../common";

export class NewUseCaseOptionsStrategy extends Strategy {
  public async apply(apiConfig: ApiConfig, options: NewUseCaseOptions) {
    const { config } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.useCase.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }
    const { endpoint, name, output } = options;
    const input = CliOptionsTools.splitArrayOption(options.input);
    const use_case: UseCaseJson = {
      name,
      endpoint,
      input,
      output,
    };
    const schema = new ApiJsonParser(apiConfig, config, texts).build({
      models: [],
      entities: [],
      use_cases: [use_case],
    });
    const result = await new ApiGenerator(config).generate(schema);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }

    return result;
  }
}
