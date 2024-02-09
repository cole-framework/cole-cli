import { Texts } from "@cole-framework/cole-cli-core";
import { Config, Frame } from "../../../../../core";
import {
  DescribeRouteInteraction,
  RouteDescription,
} from "./interactions/describe-route.interaction";

export class DescribeRouteFrame extends Frame<RouteDescription> {
  public static NAME = "describe_route_frame";
  private interaction: DescribeRouteInteraction;

  constructor(
    protected config: Config,
    protected texts: Texts
  ) {
    super(DescribeRouteFrame.NAME);
    this.interaction = new DescribeRouteInteraction(texts);
  }

  public async run(context: { name: string; endpoint: string }) {
    const { name } = context;
    return this.interaction.run({ name }, { skip: ["name"] });
  }
}
