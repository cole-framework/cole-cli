import { camelCase, paramCase } from "change-case";
import { Config, Frame, Texts } from "../../../../../core";
import { InteractionPrompts } from "../../../common";

export type RouteDescription = {
  path: string;
  http_method: string;
  controller: string;
  handler: string;
  auth: string;
  validate: boolean;
};

export class DescribeRouteFrame extends Frame<RouteDescription> {
  public static NAME = "describe_route_frame";
  constructor(
    protected config: Config,
    protected texts: Texts
  ) {
    super(DescribeRouteFrame.NAME);
  }

  public async run(context: { name: string; endpoint: string }) {
    const { texts, config } = this;

    let route;
    do {
      route = await InteractionPrompts.form(texts.get("route_form_title"), [
        {
          name: "path",
          message: texts.get("route_path"),
          hint: texts.get("hint___route_path"),
          initial: context?.name ? `/${paramCase(context?.name)}` : "",
        },
        {
          name: "http_method",
          message: texts.get("http_method"),
          initial: "GET",
          hint: texts.get("hint___http_method"),
        },
        {
          name: "controller",
          message: texts.get("controller"),
          initial: context?.name,
        },
        {
          name: "handler",
          message: texts.get("controller_handler"),
          hint: texts.get("hint___controller_handler"),
          initial: context?.name ? camelCase(`get ${context?.name}`) : "",
        },
        {
          name: "auth",
          message: texts.get("auth"),
          initial: "none",
          hint: texts.get("hint___auth"),
        },
        {
          name: "validate",
          message: texts.get("route_validate"),
          initial: "false",
          hint: texts.get("hint___route_validate"),
        },
      ]);
    } while (
      !route.path ||
      !route.controller ||
      !route.handler ||
      !route.http_method
    );

    route.validate = route.validate.toLowerCase() === "true";

    return route;
  }
}
