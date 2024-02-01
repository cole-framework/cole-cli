import chalk from "chalk";
import { Strategy } from "../../../../core/strategy";
import { NewRouteOptions, RouteJson } from "./types";
import { Texts, RouteMethodType } from "../../../../core";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ApiConfig, ApiGenerator } from "../../common";

export class NewRouteOptionsStrategy extends Strategy {
  public async apply(apiConfig: ApiConfig, options: NewRouteOptions) {
    const { config } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.route.isEndpointRequired()) {
      console.log(chalk.red(texts.get("MISSING_ENDPOINT")));
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

    const schema = new ApiJsonParser(apiConfig, config, texts).build({
      routes: [route],
    });

    const result = await new ApiGenerator(config).generate(schema);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
