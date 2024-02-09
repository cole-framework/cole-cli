import { Strategy, Texts } from "@cole-framework/cole-cli-core";
import { ProjectConfig, ApiGenerator, ApiJsonParser } from "../../common";
import { NewMapperStoryboard } from "./new-mapper.storyboard";
import { Config } from "../../../../core";

export class NewMapperInteractiveStrategy extends Strategy {
  public readonly name = "new_source_interactive_strategy";

  constructor(
    private config: Config,
    private projectConfig: ProjectConfig
  ) {
    super();
  }

  public async apply(cliPluginPackageName: string) {
    const { config, projectConfig } = this;
    const texts = Texts.load();

    const newMapperStoryboard = new NewMapperStoryboard(
      texts,
      config,
      projectConfig
    );
    const { content: json, failure } = await newMapperStoryboard.run({
      projectConfig,
    });

    if (failure) {
      console.log(failure.error);
      process.exit(1);
    }

    const schema = new ApiJsonParser(projectConfig, config, texts).build(json);
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
