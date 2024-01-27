import { WriteMethod, Texts } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { Controller } from "./types";
import { NewControllerStoryboard } from "./new-controler.storyboard";
import { ApiConfig, ApiGenerator, ApiJsonParser } from "../../common";

export type NewControllerStoryboardResult = {
  writeMethod: WriteMethod;
  components: any[];
  controller: Controller;

  [key: string]: any;
};

export class NewControllerInteractiveStrategy extends Strategy {
  public readonly name = "new_controller";
  public async apply(apiConfig: ApiConfig, ...args: unknown[]) {
    const { config } = this;
    const texts = Texts.load();

    const newControllerStoryboard = new NewControllerStoryboard(
      texts,
      config,
      apiConfig
    );
    const { content: json, failure } = await newControllerStoryboard.run();

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
