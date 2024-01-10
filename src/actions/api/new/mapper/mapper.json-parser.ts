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
        (e) => e.type.name === data.entity || e.type.name === name
      );

      if (!entity) {
        entity = EntityFactory.create(
          {
            name: data.entity || name,
            endpoint,
          },
          null,
          writeMethod.dependency,
          config,
          []
        );
        entities.push(entity);
      }

      for (const storage of storages) {
        let model;
        if (
          mappers.find(
            (m) => m.type.name === data.name && m.type.type === storage
          )
        ) {
          continue;
        }

        model = modelsRef.find(
          (m) =>
            (m.type.name === data.model || m.type.name === name) &&
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
            config,
            []
          );
          models.push(model);
        }

        const mapper = MapperFactory.create(
          {
            name,
            storage,
            endpoint,
            props: PropTools.arrayToData(props, config.reservedTypes, {
              dependencies: [],
              addons: {},
            }),
            methods: MethodTools.arrayToData(methods, config.reservedTypes, {
              dependencies: [],
              addons: {},
            }),
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
              (m) => m.type.name === type.name && m.type.type === type.type
            );

            if (!model) {
              model = ModelFactory.create(
                { name: type.name, endpoint: mapper.endpoint, type: type.type },
                writeMethod.dependency,
                config,
                []
              );
              models.push(model);
            }
            mapper.addDependency(model);
          } else if (type.isEntity) {
            let e;
            e = entities.find((m) => m.type.name === type.name);
            if (!e) {
              e = EntityFactory.create(
                { name: type.name, endpoint: mapper.endpoint },
                null,
                writeMethod.dependency,
                config,
                []
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
