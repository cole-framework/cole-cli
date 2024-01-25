import { Texts } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { ApiConfig, ApiGenerator, ApiJsonParser } from "../../common";
import { NewMapperStoryboard } from "./new-mapper.storyboard";

export class NewMapperInteractiveStrategy extends Strategy {
  public readonly name = "new_source_interactive_strategy";
  public async apply(apiConfig: ApiConfig, ...args: unknown[]) {
    const { config } = this;
    const texts = Texts.load();

    const newMapperStoryboard = new NewMapperStoryboard(
      texts,
      config,
      apiConfig
    );
    const { content: json, failure } = await newMapperStoryboard.run({
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
