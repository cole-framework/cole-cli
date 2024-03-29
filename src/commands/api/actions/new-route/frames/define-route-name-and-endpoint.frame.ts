import { Texts } from "@cole-framework/cole-cli-core";
import { Config, Frame } from "../../../../../core";
import { InputNameAndEndpointInteraction } from "../../../common";

export type RouteNameAndEndpoint = {
  name: string;
  endpoint: string;
};

export class DefineRouteNameAndEndpointFrame extends Frame<RouteNameAndEndpoint> {
  public static NAME = "define_route_name_and_endpoint_frame";

  constructor(
    protected config: Config,
    protected texts: Texts
  ) {
    super(DefineRouteNameAndEndpointFrame.NAME);
  }

  public async run() {
    const { texts, config } = this;

    return new InputNameAndEndpointInteraction({
      nameMessage: texts.get("please_provide_route_name"),
      nameHint: texts.get("hint___please_provide_route_name"),
      endpointMessage: texts.get("please_provide_endpoint"),
      endpointHint: texts.get("hint___please_provide_endpoint"),
    }).run({
      isEndpointRequired: config.components.route.isEndpointRequired(),
    });
  }
}
