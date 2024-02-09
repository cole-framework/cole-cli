import chalk from "chalk";
import { SourceJson, NewSourceOptions } from "./types";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ProjectConfig, ApiGenerator } from "../../common";
import { CliOptionsTools, Config } from "../../../../core";
import { Strategy, Texts } from "@cole-framework/cole-cli-core";

export class NewSourceOptionsStrategy extends Strategy {
  constructor(
    private config: Config,
    private projectConfig: ProjectConfig
  ) {
    super();
  }
  public async apply(options: NewSourceOptions, cliPluginPackageName: string) {
    const { config, projectConfig } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.source.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }

    const { endpoint, name, model, table } = options;
    const storages = CliOptionsTools.splitArrayOption(options.storage);
    const source: SourceJson = {
      name,
      endpoint,
      table,
      storages,
      model,
    };
    const schema = new ApiJsonParser(projectConfig, config, texts).build({
      models: [],
      entities: [],
      sources: [source],
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
