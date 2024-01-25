import chalk from "chalk";
import { Config, MethodTools, PropTools, Texts, WriteMethod } from "../../../../core";
import { Entity, EntityFactory } from "../new-entity";
import { Model, ModelFactory } from "../new-model";
import { SourceFactory } from "./source.factory";
import { SourceJson, Source } from "./types";

export class SourceJsonParser {
  constructor(
    private config: Config,
    private texts: Texts,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(
    list: SourceJson[],
    modelsRef: Model[]
  ): { sources: Source[]; models: Model[]; entities: Entity[] } {
    const { config, texts, writeMethod } = this;
    const sources: Source[] = [];
    const models: Model[] = [];
    const entities: Entity[] = [];

    for (const data of list) {
      const { name, endpoint, storages, table, props, methods } = data;

      if (!endpoint && config.components.source.isEndpointRequired()) {
        console.log(chalk.red(texts.get("MISSING_ENDPOINT")));
        console.log(
          chalk.yellow(
            texts.get("INFO_MAPPER_XXX_SKIPPED_ERROR").replace("###", name)
          )
        );
        continue;
      }

      for (const storage of storages) {
        let model;
        if (
          sources.find(
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

        const source = SourceFactory.create(
          {
            name,
            storage,
            table,
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
          model,
          writeMethod.component,
          config
        );

        source.unresolvedDependencies.forEach((type) => {
          // MODEL DEPENDENCY
          if (type.isModel) {
            let model;
            model = modelsRef.find(
              (m) => m.type.name === type.name && m.type.type === type.type
            );

            if (!model) {
              model = ModelFactory.create(
                { name: type.name, endpoint: source.endpoint, type: type.type },
                writeMethod.dependency,
                config,
                []
              );
              models.push(model);
            }
            source.addDependency(model);
          } else if (type.isEntity) {
            let e;
            e = entities.find((m) => m.type.name === type.name);
            if (!e) {
              e = EntityFactory.create(
                { name: type.name, endpoint: source.endpoint },
                null,
                writeMethod.dependency,
                config,
                []
              );
              entities.push(e);
            }
            source.addDependency(e);
          }
        });

        sources.push(source);
      }
    }

    return { sources, models, entities };
  }
}
