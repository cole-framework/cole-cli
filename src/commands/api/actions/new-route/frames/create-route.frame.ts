import { existsSync } from "fs";
import { Config, Frame, Texts, WriteMethod } from "../../../../../core";
import {
  ApiConfig,
  ApiJson,
  SelectComponentWriteMethodInteraction,
} from "../../../common";
import { RouteNameAndEndpoint } from "./define-route-name-and-endpoint.frame";
import { RequestBodyType } from "./select-request-body-type.frame";
import { ResponseBodyType } from "./select-response-body-type.frame";
import { RouteDescription } from "./interactions/describe-route.interaction";

export class CreateRouteFrame extends Frame<ApiJson> {
  public static NAME = "create_route_frame";

  constructor(
    protected config: Config,
    protected apiConfig: ApiConfig,
    protected texts: Texts
  ) {
    super(CreateRouteFrame.NAME);
  }

  public async run(
    context: RouteDescription &
      RouteNameAndEndpoint &
      RequestBodyType &
      ResponseBodyType
  ) {
    const { texts, config, apiConfig } = this;
    const {
      name,
      endpoint,
      path,
      controller,
      handler,
      http_method,
      auth,
      validate,
      request_body,
      response_body,
    } = context;
    const result: ApiJson = {
      routes: [],
    };
    const componentName = config.components.route.generateName(name);
    const componentPath = config.components.route.generatePath({
      name,
      endpoint,
    }).path;
    let writeMethod = WriteMethod.Write;

    if (apiConfig.force === false) {
      if (existsSync(componentPath)) {
        writeMethod = await new SelectComponentWriteMethodInteraction(
          texts
        ).run(componentName);
      }
    }

    if (writeMethod !== WriteMethod.Skip) {
      const request = {
        path,
        method: http_method,
        validate,
        auth,
      };

      if (request_body) {
        request["body"] = request_body;
      }

      let response;
      const responseStatuses = response_body ? Object.keys(response_body) : [];

      if (responseStatuses.length > 0) {
        response = {};
        responseStatuses.forEach((sts) => {
          response[sts] = response_body[sts];
        });
      }

      result.routes.push({
        name,
        endpoint,
        controller,
        handler,
        request,
        response,
      });
    }

    return result;
  }
}
