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
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }

    const {
      endpoint,
      name,
      path,
      auth,
      validate,
      method,
      controller,
      handler,
    } = options;
    let body;
    let response;

    try {
      body = JSON.parse(options.body.replace(/'/g, '"'));
    } catch (error) {
      body = options.body;
    }

    try {
      response = JSON.parse(options.response.replace(/'/g, '"'));
    } catch (error) {
      response = options.response;
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

    console.log("JSON", JSON.stringify(route, null, 2));

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
