import { Config, MethodTools, PropTools } from "../../../../core";
import { WriteMethod } from "../../../../core/enums";
import { Entity, EntityFactory } from "../entity";
import { Model, ModelFactory } from "../model";
import { MapperFactory } from "./mapper.factory";
import { Mapper, MapperJson } from "./types";
import chalk from "chalk";

export class MapperJsonParser {
  constructor(
    private config: Config,
    private texts: any,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(
    list: MapperJson[],
    entitiesRef: Entity[],
    modelsRef: Model[]
  ): { mappers: Mapper[]; models: Model[]; entities: Entity[] } {
    const { config, texts, writeMethod } = this;
    const mappers: Mapper[] = [];
    const models: Model[] = [];
    const entities: Entity[] = [];

    for (const data of list) {
      let entity;
      const { name, endpoint, storages, props, methods } = data;

      if (!endpoint && config.components.mapper.isEndpointRequired()) {
        console.log(chalk.red(texts.MISSING_ENDPOINT));
        console.log(
          chalk.yellow(texts.INFO_MAPPER_XXX_SKIPPED_ERROR.replace("###", name))
        );
        continue;
      }

      entity = entitiesRef.find(
        (e) => e.element.name === data.entity || e.element.name === name
      );

      if (!entity) {
        entity = EntityFactory.create(
          {
            name: data.entity || name,
            endpoint,
          },
          null,
          writeMethod.dependency,
          config
        );
        entities.push(entity);
      }

      for (const storage of storages) {
        let model;
        if (
          mappers.find((m) => m.name === data.name && m.type.type === storage)
        ) {
          continue;
        }

        model = modelsRef.find(
          (m) =>
            (m.element.name === data.model || m.element.name === name) &&
            m.type.type === storage
        );

        if (!model) {
          model = ModelFactory.create(
            {
              name: data.model || name,
              endpoint,
              type: storage,
            },
            writeMethod.dependency,
            config
          );
          models.push(model);
        }

        const mapper = MapperFactory.create(
          {
            name,
            storage,
            endpoint,
            props: PropTools.arrayToData(props, config.reservedTypes, []),
            methods: MethodTools.arrayToData(methods, config.reservedTypes, []),
          },
          entity,
          model,
          writeMethod.component,
          config
        );

        mapper.unresolvedDependencies.forEach((type) => {
          // MODEL DEPENDENCY
          if (type.isModel) {
            let model;
            model = modelsRef.find(
              (m) => m.element.name === type.name && m.type.type === type.type
            );

            if (!model) {
              model = ModelFactory.create(
                { name: type.name, endpoint: mapper.endpoint, type: type.type },
                writeMethod.dependency,
                config
              );
              models.push(model);
            }
            mapper.addDependency(model);
          } else if (type.isEntity) {
            let e;
            e = entities.find((m) => m.element.name === type.name);
            if (!e) {
              e = EntityFactory.create(
                { name: type.name, endpoint: mapper.endpoint },
                null,
                writeMethod.dependency,
                config
              );
              entities.push(e);
            }
            mapper.addDependency(e);
          }
        });

        mappers.push(mapper);
      }
    }

    return { mappers, models, entities };
  }
}
