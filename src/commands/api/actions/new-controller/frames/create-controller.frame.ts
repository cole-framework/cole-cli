import { existsSync } from "fs";
import { Config, Frame, Texts, WriteMethod } from "../../../../../core";
import {
  ProjectConfig,
  ApiJson,
  DefineMethodsInteraction,
  SelectComponentWriteMethodInteraction,
} from "../../../common";
import { EntityJson } from "../../new-entity";
import { ControllerNameAndEndpoint } from "./define-controller-name-and-endpoint.frame";
import { ModelJson } from "../../new-model";
import { HandlerJson } from "../types";

export class CreateControllerFrame extends Frame<ApiJson> {
  public static NAME = "create_controller_frame";

  constructor(
    protected config: Config,
    protected projectConfig: ProjectConfig,
    protected texts: Texts
  ) {
    super(CreateControllerFrame.NAME);
  }
  2;

  public async run(
    context: ControllerNameAndEndpoint & {
      name: string;
      endpoint: string;
      entities: EntityJson[];
      models: ModelJson[];
      handlers: HandlerJson[];
    }
  ) {
    const { texts, config, projectConfig } = this;
    const { name, endpoint, handlers } = context;
    const result: ApiJson = {
      models: [],
      entities: [],
      controllers: [],
    };
    const componentName = config.components.controller.generateName(name);
    const componentPath = config.components.controller.generatePath({
      name,
      endpoint,
    }).path;
    let writeMethod = WriteMethod.Write;

    if (projectConfig.force === false) {
      if (existsSync(componentPath)) {
        writeMethod = await new SelectComponentWriteMethodInteraction(
          texts
        ).run(componentName);
      }
    }

    if (writeMethod !== WriteMethod.Skip) {
      const { methods, ...rest } = await new DefineMethodsInteraction(
        texts,
        config,
        projectConfig.dependencies_write_method,
        result
      ).run({ endpoint: endpoint, component: "controller" });

      result.entities.push(...rest.entities);
      result.models.push(...rest.models);
      result.controllers.push({
        name,
        endpoint,
        methods,
        handlers,
      });
    }

    return result;
  }
}
