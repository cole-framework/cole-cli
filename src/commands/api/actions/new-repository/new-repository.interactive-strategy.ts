import { Strategy, Texts } from "@cole-framework/cole-cli-core";
import { ApiGenerator, ApiJsonParser } from "../../common";
import { NewRepositoryStoryboard } from "./new-repository.storyboard";
import { Config } from "../../../../core";

export class NewRepositoryInteractiveStrategy extends Strategy {
  constructor(private config: Config) {
    super();
  }
  public readonly name = "new_source_interactive_strategy";
  public async apply(cliPluginPackageName: string) {
    const { config } = this;
    const texts = Texts.load();

    const newMapperStoryboard = new NewRepositoryStoryboard(texts, config);
    const { content: json, failure } = await newMapperStoryboard.run();

    if (failure) {
      console.log(failure.error);
      process.exit(1);
    }

    const schema = new ApiJsonParser(config, texts).build(json);
    const result = await new ApiGenerator(
      config,
      cliPluginPackageName
    ).generate(schema);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
