import { WriteMethod } from "../../../../core/enums";
import { Model, ModelFactory } from "../new-model";
import { Toolset, ToolsetJson } from "./types";
import chalk from "chalk";
import { Config, Texts } from "../../../../core";
import { ToolsetFactory } from "./toolset.factory";
import { Entity, EntityFactory } from "../new-entity";

export class ToolsetJsonParser {
  constructor(
    private config: Config,
    private texts: Texts,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(
    list: ToolsetJson[],
    modelsRef: Model[],
    entitiesRef: Entity[]
  ): { models: Model[]; entities: Entity[]; toolsets: Toolset[] } {
    const { config, texts, writeMethod } = this;
    const models: Model[] = [];
    const entities: Entity[] = [];
    const toolsets: Toolset[] = [];

    for (const data of list) {
      const { name, endpoint } = data;

      if (!endpoint && config.components.toolset.isEndpointRequired()) {
        console.log(chalk.red(texts.get("missing_endpoint")));
        console.log(
          chalk.yellow(texts.get("component_###_skipped").replace("###", name))
        );
        continue;
      }

      if (toolsets.find((e) => e.type.ref === name)) {
        continue;
      }

      const toolset = ToolsetFactory.create(
        data,
        writeMethod.component,
        config,
        []
      );

      toolsets.push(toolset);
    }

    toolsets.forEach((toolset) => {
      toolset.unresolvedDependencies.forEach((type) => {
        // MODEL DEPENDENCY
        if (type.isModel) {
          let model;
          model = modelsRef.find(
            (m) => m.type.ref === type.ref && m.type.type === type.type
          );

          if (!model) {
            model = ModelFactory.create(
              { name: type.ref, endpoint: toolset.endpoint, type: type.type },
              writeMethod.dependency,
              config,
              []
            );
            models.push(model);
          }
          toolset.addDependency(model, config);
        } else if (type.isEntity) {
          let e;
          e = entitiesRef.find((m) => m.type.ref === type.ref);
          if (!e) {
            e = EntityFactory.create(
              { name: type.ref, endpoint: toolset.endpoint },
              null,
              writeMethod.dependency,
              config,
              []
            );
            entities.push(e);
          }
          toolset.addDependency(e, config);
        }
      });
    });

    return { entities, toolsets, models };
  }
}
