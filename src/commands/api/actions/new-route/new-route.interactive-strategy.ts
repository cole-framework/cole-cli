import { Texts, WriteMethod } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { ApiConfig, ApiGenerator, ApiJsonParser } from "../../common";
import { NewRouteStoryboard } from "./new-route.storyboard";
import { Route } from "./types";

export type NewRouteStoryboardResult = {
  writeMethod: WriteMethod;
  components: any[];
  route: Route;

  [key: string]: any;
};

export class NewRouteInteractiveStrategy extends Strategy {
  public readonly name = "new_route_interactive_strategy";
  public async apply(apiConfig: ApiConfig, ...args: unknown[]) {
    const { config } = this;
    const texts = Texts.load();

    const { content: json, failure } = await new NewRouteStoryboard(
      texts,
      config,
      apiConfig
    ).run({
      apiConfig,
    });

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
