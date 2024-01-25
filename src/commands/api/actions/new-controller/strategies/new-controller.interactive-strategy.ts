import { WriteMethod, Texts } from "../../../../../core";
import { Strategy } from "../../../../../core/strategy";
import { Controller } from "../types";
import { NewControllerStoryboard } from "../storyboards/new-controler.storyboard";
import { ApiConfig } from "../../../common";

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

    const newControllerStoryboard = new NewControllerStoryboard(texts, config);
    const result = await newControllerStoryboard.run();

    console.log("->", JSON.stringify(result, null, 2));
  }
}
