import chalk from "chalk";
import { paramCase, pascalCase } from "change-case";
import {
  Config,
  PropSchema,
  RouteModelLabel,
  TypeInfo,
  WriteMethod,
} from "../../../../core";
import { Controller } from "../controller";
import { Entity } from "../entity";
import { Model, ModelFactory } from "../model";
import { RouteIOFactory } from "./route-io.factory";
import { RouteModelFactory } from "./route-model.factory";
import { RouteFactory } from "./route.factory";
import { RouteModel, RouteJson, Route, RouteIO } from "./types";
import { extractParamsFromPath, hasBody, hasParams } from "./utils";

type RequestModels = {
  pathParams: RouteModel;
  queryParams: RouteModel;
  body: RouteModel;
  models: Model[];
};

type ResponseModels = {
  body: RouteModel;
  models: Model[];
};

export class RouteJsonParser {
  constructor(
    private config: Config,
    private texts: any,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  buildRequestModels(data: RouteJson, modelsRef: Model[]) {
    const { config, texts, writeMethod } = this;
    const { name, endpoint, request, response } = data;

    if (!endpoint && config.components.routeModel.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      console.log(
        chalk.yellow(
          texts.INFO_ROUTE_MODEL_XXX_SKIPPED_ERROR.replace("###", name)
        )
      );
      return;
    }

    const params = extractParamsFromPath(request.path);
    const models: Model[] = [];
    let pathParams;
    let queryParams;
    let body;

    if (params.pathParams.length > 0) {
      pathParams = RouteModelFactory.create(
        {
          name: pascalCase(`${request.method}_${name}`),
          endpoint,
          method: request.method,
          type: RouteModelLabel.PathParams,
          props: params.pathParams.map((p) => `${p}: string`),
        },
        writeMethod.dependency,
        config,
        []
      );
      models.push(pathParams);
    }

    if (params.queryParams.length > 0) {
      queryParams = RouteModelFactory.create(
        {
          name: pascalCase(`${request.method}_${name}`),
          endpoint,
          method: request.method,
          type: RouteModelLabel.QueryParams,
          props: params.queryParams.map((p) => `${p}: string`),
        },
        writeMethod.dependency,
        config,
        []
      );
      models.push(queryParams);
    }

    if (typeof request.body === "string") {
      const type = TypeInfo.create(request.body, config.reservedTypes);
      if (type.isModel) {
        body = modelsRef.find(
          (m) => m.type.name === type.name && m.type.type === type.type
        );

        if (!body) {
          body = RouteModelFactory.create(
            {
              name: type.name,
              endpoint,
              method: request.method,
              type: RouteModelLabel.RequestBody,
            },
            writeMethod.dependency,
            config,
            []
          );
        }
      }
    } else if (typeof request.body === "object") {
      const props = [];

      Object.keys(request.body).forEach((key) => {
        props.push(
          PropSchema.create(
            `${key}:${request.body[key]}`,
            config.reservedTypes,
            {
              dependencies: [],
              addons: {},
            }
          )
        );
      });

      body = RouteModelFactory.create(
        {
          name: pascalCase(`${request.method}_${name}`),
          endpoint,
          method: request.method,
          type: RouteModelLabel.RequestBody,
          props,
        },
        writeMethod.dependency,
        config,
        []
      );
    }

    return { pathParams, queryParams, body, models };
  }

  buildResponseModels(data: RouteJson, modelsRef: Model[]) {
    const { config, texts, writeMethod } = this;
    const { name, endpoint, request, response } = data;

    if (!endpoint && config.components.routeModel.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      console.log(
        chalk.yellow(
          texts.INFO_ROUTE_MODEL_XXX_SKIPPED_ERROR.replace("###", name)
        )
      );
      return;
    }

    let body;
    let models = [];

    if (typeof response === "string") {
      const type = TypeInfo.create(response, config.reservedTypes);
      if (type.isModel) {
        body = modelsRef.find(
          (m) => m.type.name === type.name && m.type.type === type.type
        );

        if (!body) {
          body = RouteModelFactory.create(
            {
              name: type.name,
              endpoint,
              method: request.method,
              type: RouteModelLabel.ResponseBody,
            },
            writeMethod.dependency,
            config,
            []
          );
        }
      }
    } else if (typeof response === "object") {
      const props = [];

      Object.keys(response).forEach((key) => {
        const resp = response[key];
        let valueType;
        if (typeof resp === "string") {
          valueType = TypeInfo.create(resp);
        } else if (typeof resp === "object") {
          const props = [];

          Object.keys(resp).forEach((k) => {
            props.push(
              PropSchema.create(`${k}:${resp[k]}`, config.reservedTypes, {
                dependencies: [],
                addons: {},
              })
            );
          });

          const model = RouteModelFactory.create(
            {
              name: pascalCase(`${request.method}_${name}${key}`),
              endpoint,
              method: request.method,
              type: RouteModelLabel.ResponseStatusBody,
              props,
            },
            writeMethod.dependency,
            config,
            []
          );
          models.push(model);
          valueType = TypeInfo.create(model);
        }

        //
        props.push(
          PropSchema.create(
            { name: key, type: valueType },
            config.reservedTypes,
            {
              dependencies: [],
              addons: {},
            }
          )
        );
      });

      body = RouteModelFactory.create(
        {
          name: pascalCase(`${request.method}_${name}`),
          endpoint,
          method: request.method,
          type: RouteModelLabel.ResponseBody,
          props,
        },
        writeMethod.dependency,
        config,
        []
      );
    }

    return { body, models };
  }

  build(
    list: RouteJson[],
    modelsRef: Model[],
    entitiesRef: Entity[],
    controllersRef: Controller[]
  ): {
    models: Model[];
    entities: Entity[];
    routes: Route[];
    route_ios: RouteIO[];
  } {
    const { config, texts, writeMethod } = this;
    const models: Model[] = [];
    const entities: Entity[] = [];
    const routes: Route[] = [];
    const route_ios: RouteIO[] = [];

    for (const data of list) {
      let input: Model;
      let output: Model;
      let requestModels: RequestModels;
      let responseModels: ResponseModels;
      let controller: Controller;
      let io;
      const { name, endpoint, request, response } = data;

      if (routes.find((r) => r.type.name === name)) {
        continue;
      }

      if (!endpoint && config.components.route.isEndpointRequired()) {
        console.log(chalk.red(texts.MISSING_ENDPOINT));
        console.log(
          chalk.yellow(texts.INFO_ROUTE_XXX_SKIPPED_ERROR.replace("###", name))
        );
        continue;
      }

      if (!endpoint && config.components.routeModel.isEndpointRequired()) {
        console.log(chalk.red(texts.MISSING_ENDPOINT));
        console.log(
          chalk.yellow(
            texts.INFO_ROUTE_MODEL_XXX_SKIPPED_ERROR.replace("###", name)
          )
        );
        continue;
      }

      if (!endpoint && config.components.routeIO.isEndpointRequired()) {
        console.log(chalk.red(texts.MISSING_ENDPOINT));
        console.log(
          chalk.yellow(
            texts.INFO_ROUTE_IO_XXX_SKIPPED_ERROR.replace("###", name)
          )
        );
        continue;
      }

      if (hasBody(request.body) || hasParams(request.path)) {
        requestModels = this.buildRequestModels(data, modelsRef);

        if (requestModels?.queryParams) {
          models.push(requestModels.queryParams);
        }
        if (requestModels?.pathParams) {
          models.push(requestModels.pathParams);
        }
        if (requestModels?.body && typeof requestModels?.body !== "string") {
          models.push(requestModels.body);
        }
        requestModels.models.forEach((model) => models.push(model));
      }

      if (hasBody(response)) {
        responseModels = this.buildResponseModels(data, modelsRef);

        if (responseModels?.body && typeof responseModels?.body !== "string") {
          models.push(responseModels.body);
        }
        responseModels.models.forEach((model) => models.push(model));
      }

      controller = controllersRef.find((c) => c.type.name === data.controller);

      if (controller) {
        const method = controller.element.findMethod(data.handler);
        console.log("WE HAVE COntroller", method);

        if (method?.params[0]) {
          const param = method.params[0];
          input = ModelFactory.create(
            {
              type: "input",
              endpoint,
              name: paramCase(`${method.name} Input`),
              alias: param.type,
            },
            writeMethod.dependency,
            config,
            []
          );
        }

        if (method?.returnType) {
          output = ModelFactory.create(
            {
              type: "output",
              endpoint,
              name: paramCase(`${method.name} Output`),
              alias: method.returnType,
            },
            writeMethod.dependency,
            config,
            []
          );
        }
      } else {
        // Missing controller
      }

      if (input || output) {
        io = RouteIOFactory.create(
          data,
          input,
          output,
          requestModels.pathParams,
          requestModels.queryParams,
          requestModels.body,
          responseModels.body,
          writeMethod.component,
          config
        );
        route_ios.push(io);
      }

      const route = RouteFactory.create(
        data,
        io,
        writeMethod.component,
        config
      );
      routes.push(route);
    }

    return { routes, route_ios, entities, models };
  }
}
