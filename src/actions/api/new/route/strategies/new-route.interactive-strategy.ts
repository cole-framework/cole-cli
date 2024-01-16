import { LangLoader, WriteMethod } from "../../../../../core";
import { Strategy } from "../../../../../core/strategy";
import { ApiData } from "../../api.types";
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
  public async apply(apiSchema: ApiData, ...args: unknown[]) {
    const { config } = this;
    const { content: texts } = LangLoader.load();

    const newRouteStoryboard = new NewRouteStoryboard(texts, config);
    const result = await newRouteStoryboard.run();

    console.log("->", JSON.stringify(result, null, 2));
  }
}
