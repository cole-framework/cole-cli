import chalk from "chalk";
import { LangLoader, CliOptionsTools } from "../../../../../core";
import { ApiDataCreationStrategy } from "../../api-data.strategy";
import { ApiData } from "../../api.types";
import { NewRepositoryOptions } from "../types";

export class NewRepositoryOptionsStrategy extends ApiDataCreationStrategy {
  public async apply(apiSchema: ApiData, options: NewRepositoryOptions) {
    const { config } = this;
    const { content: texts } = await LangLoader.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      process.exit(1);
    }

    const { endpoint, name, entity, model, impl, factory, bundle, abstract } =
      options;
    const storages = CliOptionsTools.splitArrayOption(options.storage);
    // const repository: RepositoryJson = {
    //   name,
    //   endpoint,
    //   storages: [...storages],
    //   model,
    //   entity,
    //   has_interface: options.bundle || options.interface,
    //   has_factory: options.bundle || options.factory,
    //   has_impl: options.bundle || options.impl,
    // };

    // const result = new ApiJsonParser(apiSchema.config, config, texts).build({
    //   repositories: [repository],
    // });

    // console.log("->", JSON.stringify(result, null, 2));

    // return result;
  }
}
