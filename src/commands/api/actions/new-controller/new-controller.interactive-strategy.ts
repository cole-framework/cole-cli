import { Config, WriteMethod } from "../../../../core";
import { Controller } from "./types";
import { NewControllerStoryboard } from "./new-controler.storyboard";
import { ProjectConfig, ApiGenerator, ApiJsonParser } from "../../common";
import { Strategy, Texts } from "@cole-framework/cole-cli-core";

export type NewControllerStoryboardResult = {
  writeMethod: WriteMethod;
  components: any[];
  controller: Controller;

  [key: string]: any;
};

export class NewControllerInteractiveStrategy extends Strategy {
  constructor(
    protected config: Config,
    protected projectConfig: ProjectConfig
  ) {
    super();
  }

  public readonly name = "new_controller";
  public async apply(cliPluginPackageName: string) {
    const { projectConfig, config } = this;
    const texts = Texts.load();

    const newControllerStoryboard = new NewControllerStoryboard(
      texts,
      config,
      projectConfig
    );
    const { content: json, failure } = await newControllerStoryboard.run();

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
