import { Texts } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { ApiConfig, ApiGenerator, ApiJsonParser } from "../../common";
import { NewUseCaseStoryboard } from "./new-use-case.storyboard";

export class NewUseCaseInteractiveStrategy extends Strategy {
  public readonly name = "new_use_case_interactive_strategy";
  public async apply(apiConfig: ApiConfig, ...args: unknown[]) {
    const { config } = this;
    const texts = Texts.load();

    const newUseCaseStoryboard = new NewUseCaseStoryboard(
      texts,
      config,
      apiConfig
    );
    const { content: json, failure } = await newUseCaseStoryboard.run();

    if (failure) {
      console.log(failure.error);
      process.exit(1);
    }

    const schema = new ApiJsonParser(apiConfig, config, texts).build(json);
    const result = await new ApiGenerator(config).generate(schema);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
