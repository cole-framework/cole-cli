import { Texts, WriteMethod } from "../../../../../core";
import { Strategy } from "../../../../../core/strategy";
import { ApiConfig } from "../../../common";
import { NewRouteStoryboard } from "../storyboards";
import { Route } from "../types";

export type NewRouteStoryboardResult = {
  writeMethod: WriteMethod;
  components: any[];
  route: Route;

  [key: string]: any;
};

export class NewRouteInteractiveStrategy extends Strategy {
  public readonly name = "new_route";
  public async apply(apiConfig: ApiConfig, ...args: unknown[]) {
    const { config } = this;
    const texts = Texts.load();

    const newRouteStoryboard = new NewRouteStoryboard(texts, config);
    const result = await newRouteStoryboard.run();

    console.log("->", JSON.stringify(result, null, 2));
  }
}
