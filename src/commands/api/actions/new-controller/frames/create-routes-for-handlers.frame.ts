import { Config, Frame, Texts } from "../../../../../core";
import { ApiConfig, InteractionPrompts } from "../../../common";
import { EntityJson } from "../../new-entity";
import { ModelJson } from "../../new-model";
import { RouteJson } from "../../new-route";
import { HandlerJson } from "../types";

export type HandlerRoutes = {
  routes: RouteJson[];
  models: ModelJson[];
  entities: EntityJson[];
};

export class CreateRoutesForHandlersFrame extends Frame<HandlerRoutes> {
  public static NAME = "create_routes_for_handlers_frame";

  constructor(
    protected config: Config,
    protected apiConfig: ApiConfig,
    protected texts: Texts
  ) {
    super(CreateRoutesForHandlersFrame.NAME);
  }

  public async run(context: {
    endpoint: string;
    handlers: HandlerJson[];
    entities: EntityJson[];
    models: ModelJson[];
  }) {
    const { texts, config, apiConfig } = this;
    const { handlers } = context;
    const result = { routes: [], models: [], entities: [] };
    let i = handlers.length;
    if (
      await InteractionPrompts.confirm(
        texts.get("do_you_want_to_create_routes_for_handlers")
      )
    ) {
      let route: any;
      do {
        i--;
      } while (i > 0);
    }

    return result;
  }
}
