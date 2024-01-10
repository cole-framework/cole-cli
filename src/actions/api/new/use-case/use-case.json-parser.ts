import chalk from "chalk";
import { Config, WriteMethod } from "../../../../core";
import { Entity, EntityFactory } from "../entity";
import { Model, ModelFactory } from "../model";
import { UseCaseJson, UseCase } from "./types";
import { UseCaseFactory } from "./use-case.factory";

export class UseCaseJsonParse {
  constructor(
    private config: Config,
    private texts: any,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(
    list: UseCaseJson[],
    modelsRef: Model[],
    entitiesRef: Entity[]
  ): { use_cases: UseCase[]; models: Model[]; entities: Entity[] } {
    const { config, texts, writeMethod } = this;
    const use_cases: UseCase[] = [];
    const models: Model[] = [];
    const entities: Entity[] = [];

    for (const data of list) {
      const { name, endpoint, props, methods, input, output } = data;

      if (!endpoint && config.components.source.isEndpointRequired()) {
        console.log(chalk.red(texts.MISSING_ENDPOINT));
        console.log(
          chalk.yellow(texts.INFO_MAPPER_XXX_SKIPPED_ERROR.replace("###", name))
        );
        continue;
      }

      const useCase = UseCaseFactory.create(
        {
          name,
          input,
          output,
          endpoint,
          props,
          methods,
        },
        writeMethod.component,
        config
      );

      useCase.unresolvedDependencies.forEach((type) => {
        // MODEL DEPENDENCY
        if (type.isModel) {
          let model;
          model = modelsRef.find(
            (m) => m.type.name === type.name && m.type.type === type.type
          );

          if (!model) {
            model = ModelFactory.create(
              { name: type.name, endpoint: useCase.endpoint, type: type.type },
              writeMethod.dependency,
              config,
              []
            );
            models.push(model);
          }
          useCase.addDependency(model);
        } else if (type.isEntity) {
          let entity;
          entity = entitiesRef.find((m) => m.type.name === type.name);
          if (!entity) {
            entity = EntityFactory.create(
              { name: type.name, endpoint: useCase.endpoint },
              null,
              writeMethod.dependency,
              config,
              []
            );
            entities.push(entity);
          }
          useCase.addDependency(entity);
        }
      });

      use_cases.push(useCase);
    }

    return { use_cases, models, entities };
  }
}
