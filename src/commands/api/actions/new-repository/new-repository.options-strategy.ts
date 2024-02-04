import chalk from "chalk";
import { Texts, CliOptionsTools } from "../../../../core";
import { Strategy } from "../../../../core/strategy";
import { NewRepositoryOptions, RepositoryJson } from "./types";
import { ApiConfig, ApiGenerator, ApiJsonParser } from "../../common";

export class NewRepositoryOptionsStrategy extends Strategy {
  public async apply(apiConfig: ApiConfig, options: NewRepositoryOptions) {
    const { config } = this;
    const texts = await Texts.load();

    if (!options.endpoint && config.components.model.isEndpointRequired()) {
      console.log(chalk.red(texts.get("missing_endpoint")));
      process.exit(1);
    }

    const { endpoint, name, entity, model, noFactory, noImpl, noInterface } =
      options;
    const storages = CliOptionsTools.splitArrayOption(options.storage);

    const repository: RepositoryJson = {
      name,
      endpoint,
      entity: entity || name,
      contexts: [],
      build_factory: !noFactory,
      build_interface: !noInterface,
      use_default_impl: storages.length === 1 || noImpl === true,
    };

    if (model) {
      storages.forEach((type) => {
        repository.contexts.push({ type, model });
      });
    } else {
      repository.contexts.push(...storages);
    }

    const schema = new ApiJsonParser(apiConfig, config, texts).build({
      repositories: [repository],
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
