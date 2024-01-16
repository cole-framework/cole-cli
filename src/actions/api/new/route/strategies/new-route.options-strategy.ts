import chalk from "chalk";
import { Strategy } from "../../../../../core/strategy";
import { NewRouteOptions, RouteJson } from "../types";
import { LangLoader, RouteMethodType } from "../../../../../core";
import { ApiJsonParser } from "../../api-json.parser";
import { ApiData } from "../../api.types";

export class NewRouteOptionsStrategy extends Strategy {
  public async apply(apiSchema: ApiData, options: NewRouteOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (!options.endpoint && config.components.route.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name, path, auth, validate, method } = options;
    let body;
    let response;
    let controllerWithMethod = options.handler.split(/\s*[\.]\s*/);
    let handler;
    let controller = controllerWithMethod[0];
    if (controllerWithMethod[1]) {
      const match = controllerWithMethod[1].match(
        /^(\w+)\s*(\(([a-zA-Z0-9\<\>_ ]+)\))?(:([a-zA-Z0-9\<\>_ ]+))?$/
      );
      if (match) {
        handler = match[1];
        // handler.input = match[3];
        // handler.output = match[5];
      }
    }
    try {
      body = JSON.parse(options.body);
    } catch (error) {
      body = options.body;
    }

    try {
      response = JSON.parse(options.response);
    } catch (error) {
      body = options.response;
    }

    const route: RouteJson = {
      name,
      endpoint,
      request: {
        path,
        auth,
        validate,
        method: method || RouteMethodType.Get,
        body,
      },
      response,
      handler,
      controller,
    };

    const result = new ApiJsonParser(apiSchema.config, config, texts).build({
      routes: [route],
    });

    console.log("->", JSON.stringify(result, null, 2));

    return result;
  }
}
