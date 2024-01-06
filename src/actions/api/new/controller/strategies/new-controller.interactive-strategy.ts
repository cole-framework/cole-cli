import { WriteMethod, LangLoader } from "../../../../../core";
import { ApiDataCreationStrategy } from "../../api-data.strategy";
import { ApiData } from "../../api.types";
import { Controller } from "../types";
import { NewControllerStoryboard } from "../storyboards/new-controler.storyboard";

export type NewControllerStoryboardResult = {
  writeMethod: WriteMethod;
  components: any[];
  controller: Controller;

  [key: string]: any;
};

export class NewControllerInteractiveStrategy extends ApiDataCreationStrategy {
  public readonly name = "new_controller";
  public async apply(apiSchema: ApiData, ...args: unknown[]) {
    const { config } = this;
    const { content: texts } = LangLoader.load();

    const newControllerStoryboard = new NewControllerStoryboard(texts, config);
    const result = await newControllerStoryboard.run();

    console.log("->", JSON.stringify(result, null, 2));
  }
}
