import { Config, RouteModelLabel, WriteMethod } from "../../../../../core";
import { Entity } from "../../new-entity";
import { Model } from "../../new-model";
import { RouteModelFactory } from "../route-model.factory";
import { RouteJson } from "../types";

export class QueryParamsJsonParser {
  constructor(
    private config: Config,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod },
    private models: Model[]
  ) {}

  extractQueryParams(value: string) {
    const result = [];
    const [_, queryParams] = value.split(/\s*\?\s*/);
    const queryMatches = queryParams?.match(/\w+/g);

    if (queryMatches) {
      queryMatches.forEach((match) => result.push(match));
    }

    return result;
  }

  parse(data: RouteJson) {
    const { config, writeMethod, models } = this;
    const { name, endpoint, request } = data;
    const params = this.extractQueryParams(request.path);

    if (params.length > 0) {
      const model = RouteModelFactory.create(
        {
          name,
          endpoint,
          method: request.method,
          type: RouteModelLabel.QueryParams,
          props: params.map((p) => `${p}: string`),
        },
        writeMethod.dependency,
        config,
        []
      );

      models.push(model);
      return model;
    }
  }
}
