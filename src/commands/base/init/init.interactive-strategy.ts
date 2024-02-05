import { Result, Strategy, Texts } from "../../../core";
import { InitStoryboard } from "./init.storyboard";
import { TypeScriptProjectInitStrategy } from "./init-strategies";

export class InitInteractiveStrategy extends Strategy {
  public readonly name = "new_project";
  public async apply() {
    const texts = Texts.load();

    const newProjectStoryboard = new InitStoryboard(texts);
    const { content, failure } = await newProjectStoryboard.run();

    if (failure) {
      console.log(failure.error);
      process.exit(1);
    }

    let buildStrategy: Strategy<Promise<Result>>;

    if (["typescript", "ts"].includes(content.language.toLowerCase())) {
      buildStrategy = new TypeScriptProjectInitStrategy(texts);
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
