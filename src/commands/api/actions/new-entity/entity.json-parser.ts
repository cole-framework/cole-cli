import { WriteMethod } from "../../../../core/enums";
import { Model, ModelFactory } from "../new-model";
import { Entity, EntityJson } from "./types";
import chalk from "chalk";
import { Config, Texts } from "../../../../core";
import { EntityFactory } from "./entity.factory";

export class EntityJsonParser {
  constructor(
    private config: Config,
    private texts: Texts,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(
    list: EntityJson[],
    modelsRef: Model[]
  ): { models: Model[]; entities: Entity[] } {
    const { config, texts, writeMethod } = this;
    const models: Model[] = [];
    const entities: Entity[] = [];

    for (const data of list) {
      const { name, endpoint, has_model, props } = data;
      let model;

      if (!endpoint && config.components.entity.isEndpointRequired()) {
        console.log(chalk.red(texts.get("missing_endpoint")));
        console.log(
          chalk.yellow(texts.get("component_###_skipped").replace("###", name))
        );
        continue;
      }

      if (entities.find((e) => e.type.ref === name)) {
        continue;
      }

      if (
        has_model &&
        modelsRef.findIndex(
          (m) => m.type.ref === name && m.type.type === "json"
        ) === -1
      ) {
        model = ModelFactory.create(
          { name, endpoint, type: "json", props },
          writeMethod.dependency,
          config,
          []
        );

        models.push(model);
      }

      const entity = EntityFactory.create(
        data,
        model,
        writeMethod.component,
        config,
        []
      );

      entities.push(entity);
    }

    entities.forEach((entity) => {
      entity.unresolvedDependencies.forEach((type) => {
        // MODEL DEPENDENCY
        if (type.isModel) {
          let model;
          model = modelsRef.find(
            (m) => m.type.ref === type.ref && m.type.type === type.type
          );

          if (!model) {
            model = ModelFactory.create(
              { name: type.ref, endpoint: entity.endpoint, type: type.type },
              writeMethod.dependency,
              config,
              []
            );
            models.push(model);
          }
          entity.addDependency(model, config);
        } else if (type.isEntity) {
          let e;
          e = entities.find((m) => m.type.ref === type.ref);
          if (!e) {
            e = EntityFactory.create(
              { name: type.ref, endpoint: entity.endpoint },
              null,
              writeMethod.dependency,
              config,
              []
            );
            entities.push(e);
          }
          entity.addDependency(e, config);
        }
      });
    });

    return { entities, models };
  }
}
