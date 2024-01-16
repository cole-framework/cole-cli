import chalk from "chalk";
import { Strategy } from "../../../../../core/strategy";
import { NewControllerOptions, ControllerJson, HandlerJson } from "../types";
import { ApiJsonParser } from "../../api-json.parser";
import { CliOptionsTools, LangLoader } from "../../../../../core";
import { ApiData } from "../../api.types";

export class NewControllerOptionsStrategy extends Strategy {
  public async apply(apiSchema: ApiData, options: NewControllerOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (
      !options.endpoint &&
      config.components.controller.isEndpointRequired()
    ) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name } = options;
    const handlers: HandlerJson[] = [];
    CliOptionsTools.splitArrayOption(options.handlers).forEach((value) => {
      const match = value.match(
        /^(\w+)\s*(\(([a-zA-Z0-9\<\>_ ]+)\))?(:([a-zA-Z0-9\<\>_ ]+))?$/
      );
      if (match) {
        handlers.push({ name: match[1], input: match[3], output: match[5] });
      }
    });

    const controller: ControllerJson = {
      name,
      endpoint,
      handlers,
    };

    const result = new ApiJsonParser(apiSchema.config, config, texts).build({
      controllers: [controller],
    });

    console.log("->", JSON.stringify(result, null, 2));

    return result;
  }
}
