import { Texts, Strategy } from "../../../../core";
import { ApiGenerator } from "../../common/api-generator";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ApiConfig } from "../../common/api.config";
import { NewEntityStoryboard } from "./new-entity.storyboard";

export class NewEntityInteractiveStrategy extends Strategy {
  public readonly name = "new_entity_interactive_strategy";

  public async apply(apiConfig: ApiConfig) {
    const { config } = this;
    const texts = Texts.load();

    const newEntityStoryboard = new NewEntityStoryboard(
      texts,
      config,
      apiConfig
    );
    const { content: json, failure } = await newEntityStoryboard.run({
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
