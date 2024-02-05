import { Result, Strategy, Texts } from "../../../core";
import { NewProjectStoryboard } from "./new-project.storyboard";
import { TypeScriptProjectBuildStrategy } from "./build-strategies";

export class NewProjectInteractiveStrategy extends Strategy {
  public readonly name = "new_project";
  public async apply() {
    const texts = Texts.load(true);
    const newProjectStoryboard = new NewProjectStoryboard(texts);
    const { content, failure } = await newProjectStoryboard.run();

    if (failure) {
      console.log(failure.error);
      process.exit(1);
    }

    let buildStrategy: Strategy<Promise<Result>>;

    if (["typescript", "ts"].includes(content.language.toLowerCase())) {
      buildStrategy = new TypeScriptProjectBuildStrategy(texts);
    } else {
      throw Error(
        `not_supported_language_###`.replace("###", content.language)
      );
    }

    const result = await buildStrategy.apply(content);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
