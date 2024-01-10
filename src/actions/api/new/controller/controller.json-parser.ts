import chalk from "chalk";
import { WriteMethod } from "../../../../core/enums";
import { Model, ModelFactory } from "../model";
import { Controller, ControllerJson } from "./types";
import { Config } from "../../../../core";
import { ControllerFactory } from "./controller.factory";
import { Entity } from "../entity/types";
import { EntityFactory } from "../entity";

export class ControllerJsonParser {
  constructor(
    private config: Config,
    private texts: any,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(
    list: ControllerJson[],
    modelsRef: Model[],
    entitiesRef: Entity[]
  ): { models: Model[]; entities: Entity[]; controllers: Controller[] } {
    const { config, texts, writeMethod } = this;
    const models: Model[] = [];
    const entities: Entity[] = [];
    const controllers: Controller[] = [];

    for (const data of list) {
      const { name, endpoint, handlers } = data;

      if (!endpoint && config.components.controller.isEndpointRequired()) {
        console.log(chalk.red(texts.MISSING_ENDPOINT));
        console.log(
          chalk.yellow(
            texts.INFO_CONTROLLER_XXX_SKIPPED_ERROR.replace("###", name)
          )
        );
        continue;
      }

      if (controllers.find((e) => e.type.name === name)) {
        continue;
      }

      if (Array.isArray(handlers)) {
        handlers.forEach((handler) => {
          if (typeof handler === "object") {
            if (typeof handler.input === "object") {
              const entity = EntityFactory.create(
                {
                  name: `${handler.name}Input`,
                  props: Object.keys(handler.input).map(
                    (key) => `${key}:${handler.input[key]}`
                  ),
                  endpoint,
                },
                null,
                writeMethod.dependency,
                config,
                []
              );
              handler.input = entity.element.name;
              entities.push(entity);
            }
            if (typeof handler.output === "object") {
              const entity = EntityFactory.create(
                {
                  name: `${handler.name}Output`,
                  props: Object.keys(handler.output).map(
                    (key) => `${key}:${handler.output[key]}`
                  ),
                  endpoint,
                },
                null,
                writeMethod.dependency,
                config,
                []
              );
              handler.output = entity.element.name;
              entities.push(entity);
            }
          }
        });
      }

      const controller = ControllerFactory.create(
        data,
        writeMethod.component,
        config,
        []
      );

      controller.unresolvedDependencies.forEach((type) => {
        // MODEL DEPENDENCY
        if (type.isModel) {
          let model;
          model = modelsRef.find(
            (m) => m.type.name === type.name && m.type.type === type.type
          );

          if (!model) {
            model = models.find(
              (m) => m.type.name === type.name && m.type.type === type.type
            );
          }

          if (!model) {
            model = ModelFactory.create(
              {
                name: type.name,
                endpoint: controller.endpoint,
                type: type.type,
              },
              writeMethod.dependency,
              config,
              []
            );
            models.push(model);
          }
          controller.addDependency(model);
        } else if (type.isEntity) {
          let entity;
          entity = entitiesRef.find((m) => m.type.name === type.name);

          if (!entity) {
            entity = entities.find((m) => m.type.name === type.name);
          }

          if (!entity) {
            entity = EntityFactory.create(
              { name: type.name, endpoint: controller.endpoint },
              null,
              writeMethod.dependency,
              config,
              []
            );
            entities.push(entity);
          }
          controller.addDependency(entity);
        }
      });

      controllers.push(controller);
    }

    return { controllers, entities, models };
  }
}
