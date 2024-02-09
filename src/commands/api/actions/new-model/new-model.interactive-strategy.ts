import { Strategy, Texts } from "@cole-framework/cole-cli-core";
import { ProjectConfig } from "../../common";
import { ApiGenerator } from "../../common/api-generator";
import { ApiJsonParser } from "../../common/api-json.parser";
import { NewModelStoryboard } from "./new-model.storyboard";
import { Config } from "../../../../core";

export class NewModelInteractiveStrategy extends Strategy {
  public readonly name = "new_model_interactive_strategy";

  constructor(
    private config: Config,
    private projectConfig: ProjectConfig
  ) {
    super();
  }

  public async apply(cliPluginPackageName: string) {
    const { config, projectConfig } = this;
    const texts = Texts.load();

    const newModelStoryboard = new NewModelStoryboard(
      texts,
      config,
      projectConfig
    );
    const { content: json, failure } = await newModelStoryboard.run();

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
