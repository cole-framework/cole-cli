import { Config, MethodTools, PropTools, Texts } from "../../../../core";
import { WriteMethod } from "../../../../core/enums";
import { Entity, EntityFactory } from "../new-entity";
import { Model, ModelFactory } from "../new-model";
import { MapperFactory } from "./mapper.factory";
import { Mapper, MapperJson } from "./types";
import chalk from "chalk";

export class MapperJsonParser {
  constructor(
    private config: Config,
    private texts: Texts,
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
        console.log(chalk.red(texts.get("missing_endpoint")));
        console.log(
          chalk.yellow(texts.get("component_###_skipped").replace("###", name))
        );
        continue;
      }

      entity = entitiesRef.find(
        (e) => e.type.ref === data.entity || e.type.ref === name
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
            (m) => m.type.ref === data.name && m.type.type === storage
          )
        ) {
          continue;
        }

        model = modelsRef.find(
          (m) =>
            (m.type.ref === data.model || m.type.ref === name) &&
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
            props: PropTools.arrayToData(props, config, {
              dependencies: [],
              addons: {},
            }),
            methods: MethodTools.arrayToData(methods, config, {
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
              (m) => m.type.ref === type.ref && m.type.type === type.type
            );

            if (!model) {
              model = ModelFactory.create(
                { name: type.ref, endpoint: mapper.endpoint, type: type.type },
                writeMethod.dependency,
                config,
                []
              );
              models.push(model);
            }
            mapper.addDependency(model, config);
          } else if (type.isEntity) {
            let e;
            e = entities.find((m) => m.type.ref === type.ref);
            if (!e) {
              e = EntityFactory.create(
                { name: type.ref, endpoint: mapper.endpoint },
                null,
                writeMethod.dependency,
                config,
                []
              );
              entities.push(e);
            }
            mapper.addDependency(e, config);
          }
        });

        mappers.push(mapper);
      }
    }

    return { mappers, models, entities };
  }
}
