import chalk from "chalk";
import { NewRouteOptions, RouteJson } from "./types";
import { Config, RouteMethodType } from "../../../../core";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ProjectConfig, ApiGenerator } from "../../common";
import { Strategy, Texts } from "@cole-framework/cole-cli-core";

export class NewRouteOptionsStrategy extends Strategy {
  constructor(
    private config: Config,
    private projectConfig: ProjectConfig
  ) {
    super();
  }
  public async apply(options: NewRouteOptions, cliPluginPackageName: string) {
    const { config, projectConfig } = this;
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

    const schema = new ApiJsonParser(projectConfig, config, texts).build({
      routes: [route],
    });

    const result = await new ApiGenerator(
      config,
      cliPluginPackageName
    ).generate(schema);

    if (result.isFailure) {
      console.log(result.failure.error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}
