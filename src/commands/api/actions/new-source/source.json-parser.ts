import chalk from "chalk";
import {
  Config,
  MethodTools,
  PropTools,
  TestCaseSchema,
} from "../../../../core";
import { Entity, EntityFactory } from "../new-entity";
import { Model, ModelFactory } from "../new-model";
import { SourceFactory } from "./source.factory";
import { SourceJson, Source } from "./types";
import { TestSuite, TestSuiteFactory } from "../new-test-suite";
import { Texts, WriteMethod } from "@cole-framework/cole-cli-core";

export class SourceJsonParser {
  constructor(
    private config: Config,

    private texts: Texts,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(
    list: SourceJson[],
    modelsRef: Model[]
  ): {
    sources: Source[];
    models: Model[];
    entities: Entity[];
    test_suites: TestSuite[];
  } {
    const { config, texts, writeMethod } = this;
    const sources: Source[] = [];
    const models: Model[] = [];
    const entities: Entity[] = [];
    const test_suites: TestSuite[] = [];

    for (const data of list) {
      const { name, endpoint, storages, table, props, methods } = data;

      if (!endpoint && config.components.source.isEndpointRequired()) {
        console.log(chalk.red(texts.get("missing_endpoint")));
        console.log(
          chalk.yellow(texts.get("component_###_skipped").replace("###", name))
        );
        continue;
      }

      for (const storage of storages) {
        let model;
        if (
          sources.find((m) => m.type.ref === name && m.type.type === storage)
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

        const source = SourceFactory.create(
          {
            name,
            storage,
            table,
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
          model,
          writeMethod.component,
          config
        );

        if (!config.command.skip_tests && source.element.methods.length > 0) {
          //
          const suite = TestSuiteFactory.create(
            { name, endpoint, type: "unit_tests" },
            source,
            writeMethod.component,
            config
          );

          source.element.methods.forEach((method) => {
            suite.element.addTest(
              TestCaseSchema.create({
                group: { name: suite.element.name, is_async: false },
                is_async: method.isAsync,
                name: method.name,
                methods: [method],
              })
            );
          });
          test_suites.push(suite);
        }

        source.unresolvedDependencies.forEach((type) => {
          // MODEL DEPENDENCY
          if (type.isModel) {
            let model;
            model = modelsRef.find(
              (m) => m.type.ref === type.ref && m.type.type === type.type
            );

            if (!model) {
              model = ModelFactory.create(
                { name: type.ref, endpoint: source.endpoint, type: type.type },
                writeMethod.dependency,
                config,
                []
              );
              models.push(model);
            }
            source.addDependency(model, config);
          } else if (type.isEntity) {
            let e;
            e = entities.find((m) => m.type.ref === type.ref);
            if (!e) {
              e = EntityFactory.create(
                { name: type.ref, endpoint: source.endpoint },
                null,
                writeMethod.dependency,
                config,
                []
              );
              entities.push(e);
            }
            source.addDependency(e, config);
          }
        });

        sources.push(source);
      }
    }

    return { sources, models, entities, test_suites };
  }
}
