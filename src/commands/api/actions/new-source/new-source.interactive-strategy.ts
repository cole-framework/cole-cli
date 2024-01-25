import { Texts } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { ApiConfig, ApiGenerator, ApiJsonParser } from "../../common";
import { NewSourceStoryboard } from "./new-source.storyboard";

export class NewSourceInteractiveStrategy extends Strategy {
  public readonly name = "new_source_interactive_strategy";
  public async apply(apiConfig: ApiConfig, ...args: unknown[]) {
    const { config } = this;
    const texts = Texts.load();

    const newSourceStoryboard = new NewSourceStoryboard(
      texts,
      config,
      apiConfig
    );
    const { content: json, failure } = await newSourceStoryboard.run({
      apiConfig,
    });

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
