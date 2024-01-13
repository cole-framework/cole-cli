import { WriteMethod } from "../../../../core/enums";
import { Model, ModelFactory } from "../model";
import { Tool, ToolJson } from "./types";
import chalk from "chalk";
import { Config } from "../../../../core";
import { ToolFactory } from "./tool.factory";
import { Entity } from "../entity";

export class ToolJsonParser {
  constructor(
    private config: Config,
    private texts: any,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  build(
    list: ToolJson[],
    modelsRef: Model[],
    entitiesRef: Entity[]
  ): { models: Model[]; entities: Entity[]; tools: Tool[] } {
    const { config, texts, writeMethod } = this;
    const models: Model[] = [];
    const entities: Entity[] = [];
    const tools: Tool[] = [];

    for (const data of list) {
      const { name, endpoint } = data;

      if (!endpoint && config.components.entity.isEndpointRequired()) {
        console.log(chalk.red(texts.MISSING_ENDPOINT));
        console.log(
          chalk.yellow(texts.INFO_TOOL_XXX_SKIPPED_ERROR.replace("###", name))
        );
        continue;
      }

      if (tools.find((e) => e.type.name === name)) {
        continue;
      }

      const tool = ToolFactory.create(data, writeMethod.component, config, []);

      tools.push(tool);
    }

    tools.forEach((tool) => {
      tool.unresolvedDependencies.forEach((type) => {
        // MODEL DEPENDENCY
        if (type.isModel) {
          let model;
          model = modelsRef.find(
            (m) => m.type.name === type.name && m.type.type === type.type
          );

          if (!model) {
            model = ModelFactory.create(
              { name: type.name, endpoint: tool.endpoint, type: type.type },
              writeMethod.dependency,
              config,
              []
            );
            models.push(model);
          }
          tool.addDependency(model);
        } else if (type.isEntity) {
          let e;
          e = entitiesRef.find((m) => m.type.name === type.name);
          if (!e) {
            e = ToolFactory.create(
              { name: type.name, endpoint: tool.endpoint },
              writeMethod.dependency,
              config,
              []
            );
            entities.push(e);
          }
          tool.addDependency(e);
        }
      });
    });

    return { entities, tools, models };
  }
}
