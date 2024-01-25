import { Texts, Strategy } from "../../../../core";
import { ApiConfig } from "../../common";
import { ApiGenerator } from "../../common/api-generator";
import { ApiJsonParser } from "../../common/api-json.parser";
import { NewToolsetStoryboard } from "./new-toolset.storyboard";

export class NewToolsetInteractiveStrategy extends Strategy {
  public readonly name = "new_toolset_interactive_strategy";

  public async apply(apiConfig: ApiConfig) {
    const { config } = this;
    const texts = Texts.load();

    const newModelStoryboard = new NewToolsetStoryboard(
      texts,
      config,
      apiConfig
    );
    const { content: json, failure } = await newModelStoryboard.run();

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
