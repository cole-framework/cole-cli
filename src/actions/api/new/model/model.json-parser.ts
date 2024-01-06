import { WriteMethod } from "../../../../core/enums";
import { Model, ModelFactory } from ".";
import { ModelJson } from "./types";
import chalk from "chalk";
import { Config } from "../../../../core";

export class ModelJsonParser {
  constructor(
    private config: Config,
    private texts: any,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(list: ModelJson[]): { models: Model[] } {
    const { config, texts, writeMethod } = this;
    const models: Model[] = [];

    for (const data of list) {
      if (!data.endpoint && config.components.model.isEndpointRequired()) {
        console.log(chalk.red(texts.MISSING_ENDPOINT));
        console.log(
          chalk.yellow(
            texts.INFO_MODEL_XXX_SKIPPED_ERROR.replace("###", data.name)
          )
        );
        continue;
      }

      const { types, ...rest } = data;

      for (const type of types) {
        if (models.find((m) => m.name === data.name && m.type.type === type)) {
          continue;
        }

        const model = ModelFactory.create(
          { ...rest, type },
          writeMethod.component,
          config
        );

        models.push(model);
      }
    }

    models.forEach((model) => {
      model.unresolvedDependencies.forEach((type) => {
        if (type.isModel) {
          let m;
          m = models.find(
            (m) => m.element.name === type.name && m.type.type === type.type
          );
          if (!m) {
            m = ModelFactory.create(
              { name: type.name, endpoint: model.endpoint, type: type.type },
              writeMethod.dependency,
              config
            );
            models.push(m);
          }
          model.addDependency(m);
        } else if (type.isEntity) {
          //
        }
      });
    });

    return { models };
  }
}
