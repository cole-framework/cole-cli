import { Config, RouteModelLabel, WriteMethod } from "../../../../../core";
import { Model } from "../../new-model";
import { RouteModelFactory } from "../route-model.factory";
import { RouteJson } from "../types";

export class PathParamsJsonParser {
  constructor(
    private config: Config,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod },
    private models: Model[]
  ) {}

  extractPathParams(value: string) {
    const result = [];
    const [pathParams, _] = value.split(/\s*\?\s*/);
    const pathMatches = pathParams?.match(/\:\w+/g);

    if (pathMatches) {
      pathMatches.forEach((match) =>
        result.push(match.replace(/\s*\:\s*/, ""))
      );
    }

    return result;
  }

  parse(data: RouteJson) {
    const { config, writeMethod, models } = this;
    const { name, endpoint, request } = data;
    const params = this.extractPathParams(request.path);

    if (params.length > 0) {
      const model = RouteModelFactory.create(
        {
          name,
          endpoint,
          method: request.method,
          type: RouteModelLabel.PathParams,
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
