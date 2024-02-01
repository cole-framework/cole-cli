import chalk from "chalk";
import { WriteMethod } from "../../../../core/enums";
import { Model, ModelFactory } from "../new-model";
import { Controller, ControllerJson, HandlerJson } from "./types";
import {
  Config,
  EntityType,
  PrimitiveType,
  Texts,
  TypeInfo,
} from "../../../../core";
import { ControllerFactory } from "./controller.factory";
import { Entity } from "../new-entity/types";
import { EntityFactory } from "../new-entity";
import { pascalCase } from "change-case";

export class ControllerInputJsonParser {
  constructor(
    private config: Config,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(handler: HandlerJson, endpoint: string) {
    const { config, writeMethod } = this;
    let entity: Entity;
    let type: TypeInfo;

    if (typeof handler.input === "object") {
      entity = EntityFactory.create(
        {
          name: pascalCase(`${handler.name}Input`),
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

      type = entity.type;
    } else if (typeof handler.input === "string") {
      type = TypeInfo.create(handler.input, config);
    }

    return { entity, type };
  }
}

export class ControllerOutputJsonParser {
  constructor(
    private config: Config,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(handler: HandlerJson, endpoint: string) {
    const { config, writeMethod } = this;
    let entity: Entity;
    let type: TypeInfo;

    if (typeof handler.output === "object") {
      entity = EntityFactory.create(
        {
          name: pascalCase(`${handler.name}Output`),
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

      type = entity.type;
    } else if (typeof handler.output === "string") {
      type = TypeInfo.create(handler.output, config);
    } else {
      type = PrimitiveType.create("void");
    }

    return { entity, type };
  }
}

export class ControllerJsonParser {
  private inputParser: ControllerInputJsonParser;
  private outputParser: ControllerOutputJsonParser;

  constructor(
    private config: Config,
    private texts: Texts,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {
    this.inputParser = new ControllerInputJsonParser(config, writeMethod);
    this.outputParser = new ControllerOutputJsonParser(config, writeMethod);
  }

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
        console.log(chalk.red(texts.get("missing_endpoint")));
        console.log(
          chalk.yellow(texts.get("component_###_skipped").replace("###", name))
        );
        continue;
      }

      if (controllers.find((e) => e.type.ref === name)) {
        continue;
      }

      if (Array.isArray(handlers)) {
        handlers.forEach((handler) => {
          if (typeof handler === "object") {
            const i = this.inputParser.build(handler, endpoint);
            if (i) {
              handler.input = i.type.name;
              if (i.entity) {
                entities.push(i.entity);
              }
            }
            const o = this.outputParser.build(handler, endpoint);
            handler.output = o.type.name;
            if (o.entity) {
              entities.push(o.entity);
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
            (m) => m.type.ref === type.ref && m.type.type === type.type
          );

          if (!model) {
            model = models.find(
              (m) => m.type.ref === type.ref && m.type.type === type.type
            );
          }

          if (!model) {
            model = ModelFactory.create(
              {
                name: type.ref,
                endpoint: controller.endpoint,
                type: type.type,
              },
              writeMethod.dependency,
              config,
              []
            );
            models.push(model);
          }
          controller.addDependency(model, config);
        } else if (type.isEntity) {
          let entity;
          entity = entitiesRef.find((m) => m.type.ref === type.ref);

          if (!entity) {
            entity = entities.find((m) => m.type.ref === type.ref);
          }

          if (!entity) {
            entity = EntityFactory.create(
              { name: type.ref, endpoint: controller.endpoint },
              null,
              writeMethod.dependency,
              config,
              []
            );
            entities.push(entity);
          }
          controller.addDependency(entity, config);
        }
      });

      controllers.push(controller);
    }

    return { controllers, entities, models };
  }
}
