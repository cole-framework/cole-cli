import { existsSync } from "fs";
import { Config, Frame, WriteMethod } from "../../../../../core";
import {
  ApiJson,
  DefineMethodsInteraction,
  SelectComponentWriteMethodInteraction,
} from "../../../common";
import { EntityJson } from "../../new-entity";
import { ControllerNameAndEndpoint } from "./define-controller-name-and-endpoint.frame";
import { ModelJson } from "../../new-model";
import { HandlerJson } from "../types";
import { Texts } from "@cole-framework/cole-cli-core";

export class CreateControllerFrame extends Frame<ApiJson> {
  public static NAME = "create_controller_frame";

  constructor(
    protected config: Config,
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
    const { texts, config } = this;
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

    if (config.project.force === false) {
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
        config.project.dependencies_write_method,
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
