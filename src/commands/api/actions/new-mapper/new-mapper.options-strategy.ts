import chalk from "chalk";
import { MapperJson, NewMapperOptions } from "./types";
import { CliOptionsTools, Config } from "../../../../core";
import { ApiJsonParser } from "../../common/api-json.parser";
import { ProjectConfig, ApiGenerator } from "../../common";
import { Strategy, Texts } from "@cole-framework/cole-cli-core";

export class NewMapperOptionsStrategy extends Strategy {
  constructor(
    private config: Config,
    private projectConfig: ProjectConfig
  ) {
    super();
  }
  public async apply(options: NewMapperOptions, cliPluginPackageName: string) {
    const { config, projectConfig } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }

    const { endpoint, name, entity, model } = options;
    const storages = CliOptionsTools.splitArrayOption(options.storage);
    const mapper: MapperJson = {
      name,
      endpoint,
      storages,
      model,
      entity,
    };

    const schema = new ApiJsonParser(projectConfig, config, texts).build({
      entities: [],
      models: [],
      mappers: [mapper],
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
