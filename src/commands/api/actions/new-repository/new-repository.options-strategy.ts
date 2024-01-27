import chalk from "chalk";
import { Texts, CliOptionsTools } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { NewRepositoryOptions } from "./types";
import { ApiConfig } from "../../common";

export class NewRepositoryOptionsStrategy extends Strategy {
  public async apply(apiConfig: ApiConfig, options: NewRepositoryOptions) {
    const { config } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
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

    // const result = new ApiJsonParser(apiConfig, config, texts).build({
    //   repositories: [repository],
    // });

    // console.log("->", JSON.stringify(result, null, 2));

    // return result;
  }
}
