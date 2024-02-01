import {
  Config,
  PropSchema,
  RouteModelLabel,
  TypeInfo,
  WriteMethod,
} from "../../../../../core";
import { Entity, EntityFactory } from "../../new-entity";
import { Model, ModelFactory } from "../../new-model";
import { RouteModelFactory } from "../route-model.factory";
import { RouteJson } from "../types";

export class RequestBodyJsonParser {
  constructor(
    private config: Config,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod },
    private models: Model[],
    private entities: Entity[]
  ) {}

  parse(data: RouteJson, modelsRef: Model[], entitiesRef: Entity[]) {
    const { config, writeMethod, models, entities } = this;
    const { endpoint, request, name } = data;
    const props = [];

    if (typeof request.body === "string") {
      const type = TypeInfo.create(request.body, config);
      if (type.isModel) {
        const body = modelsRef.find(
          (m) => m.type.ref === type.ref && m.type.type === type.type
        );

        if (body) {
          return body;
        }
      }
    } else if (typeof request.body === "object") {
      Object.keys(request.body).forEach((key) => {
        const p = PropSchema.create(`${key}:${request.body[key]}`, config, {
          dependencies: [],
          addons: {},
        });
        props.push(p);
        p.listTypes().forEach((type) => {
          if (
            type.isModel &&
            modelsRef.findIndex((m) => m.type.name === type.name) === -1
          ) {
            models.push(
              ModelFactory.create(
                { name: type.ref, type: type.type, endpoint },
                writeMethod.dependency,
                config,
                []
              )
            );
          } else if (
            type.isEntity &&
            entitiesRef.findIndex((m) => m.type.ref === type.ref) === -1
          ) {
            entities.push(
              EntityFactory.create(
                { name: type.ref, endpoint },
                null,
                writeMethod.dependency,
                config,
                []
              )
            );
          }
        });
      });
    } else {
      return null;
    }

    const model = RouteModelFactory.create(
      {
        name,
        endpoint,
        method: request.method,
        type: RouteModelLabel.RequestBody,
        props,
      },
      writeMethod.dependency,
      config,
      []
    );

    models.push(model);
    return model;
  }
}
