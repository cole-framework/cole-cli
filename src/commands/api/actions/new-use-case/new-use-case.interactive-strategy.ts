import { Strategy, Texts } from "@cole-framework/cole-cli-core";
import { ProjectConfig, ApiGenerator, ApiJsonParser } from "../../common";
import { NewUseCaseStoryboard } from "./new-use-case.storyboard";
import { Config } from "../../../../core";

export class NewUseCaseInteractiveStrategy extends Strategy {
  public readonly name = "new_use_case_interactive_strategy";

  constructor(
    private config: Config,
    private projectConfig: ProjectConfig
  ) {
    super();
  }

  public async apply(cliPluginPackageName: string) {
    const { config, projectConfig } = this;
    const texts = Texts.load();

    const newUseCaseStoryboard = new NewUseCaseStoryboard(
      texts,
      config,
      projectConfig
    );
    const { content: json, failure } = await newUseCaseStoryboard.run();

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
