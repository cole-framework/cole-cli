import { Mapper, MapperJson } from "./mapper";
import {
  Repository,
  RepositoryFactory,
  RepositoryImpl,
  RepositoryJson,
} from "./repository";
import { Route, RouteJsonParser, RouteJson, RouteIO } from "./route";
import { Model, ModelJson } from "./model";
import { Source, SourceJsonParser, SourceJson } from "./source";
import { UseCase, UseCaseJsonParse, UseCaseJson } from "./use-case";
import { Config, WriteMethod } from "../../../core";
import { ApiComponentCollection, ApiSchema } from "./api.schema";
import { ControllerJsonParser } from "./controller/controller.json-parser";
import { EntityJsonParser } from "./entity/entity.json-parser";
import { MapperJsonParser } from "./mapper/mapper.json-parser";
import { ModelJsonParser } from "./model/model.json-parser";
import { RepositoryJsonParser } from "./repository/repository.json-parser";
import { ApiConfig, ApiJson } from "./api.types";
import { Controller, ControllerJson } from "./controller/types";
import { Entity, EntityJson } from "./entity/types";
import { ToolJson, ToolJsonParser } from "./tool";

export default class Fooooooo {
  
}

export class ApiJsonParser {
  private apiSchema = new ApiSchema();
  private writeMethod: { component: WriteMethod; dependency: WriteMethod };

  constructor(
    apiConfig: ApiConfig,
    private config: Config,
    private texts: any
  ) {
    this.writeMethod = {
      component: apiConfig.write_method,
      dependency: apiConfig.with_dependencies
        ? apiConfig.write_method
        : WriteMethod.Skip,
    };
  }

  parseModels(list: ModelJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new ModelJsonParser(config, texts, writeMethod).build(list);

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });
  }

  parseEntities(list: EntityJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new EntityJsonParser(config, texts, writeMethod).build(
      list,
      apiSchema.models.toArray()
    );

    result.entities.forEach((e) => {
      apiSchema.entities.add(e);
    });

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });
  }

  parseTools(list: ToolJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new ToolJsonParser(config, texts, writeMethod).build(
      list,
      apiSchema.models.toArray(),
      apiSchema.entities.toArray()
    );

    result.tools.forEach((t) => {
      apiSchema.tools.add(t);
    });

    result.entities.forEach((e) => {
      apiSchema.entities.add(e);
    });

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });
  }

  parseMappers(list: MapperJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new MapperJsonParser(config, texts, writeMethod).build(
      list,
      apiSchema.entities.toArray(),
      apiSchema.models.toArray()
    );

    result.mappers.forEach((m) => {
      apiSchema.mappers.add(m);
    });

    result.entities.forEach((e) => {
      apiSchema.entities.add(e);
    });

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });
  }

  parseSources(list: SourceJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new SourceJsonParser(config, texts, writeMethod).build(
      list,
      apiSchema.models.toArray()
    );

    result.sources.forEach((s) => {
      apiSchema.sources.add(s);
    });

    result.entities.forEach((e) => {
      apiSchema.entities.add(e);
    });

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });
  }

  parseUseCases(list: UseCaseJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new UseCaseJsonParse(config, texts, writeMethod).build(
      list,
      apiSchema.models.toArray(),
      apiSchema.entities.toArray()
    );

    result.use_cases.forEach((u) => {
      apiSchema.use_cases.add(u);
    });

    result.entities.forEach((e) => {
      apiSchema.entities.add(e);
    });

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });
  }

  parseRepositories(list: RepositoryJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new RepositoryJsonParser(config, texts, writeMethod).build(
      list,
      apiSchema.entities.toArray(),
      apiSchema.models.toArray(),
      apiSchema.mappers.toArray(),
      apiSchema.sources.toArray()
    );

    result.repositories.forEach((u) => {
      apiSchema.repositories.add(u);
    });

    result.repository_impls.forEach((u) => {
      apiSchema.repository_impls.add(u);
    });

    result.repository_factories.forEach((f) => {
      apiSchema.repository_factories.add(f);
    });

    result.entities.forEach((e) => {
      apiSchema.entities.add(e);
    });

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });

    result.mappers.forEach((m) => {
      apiSchema.mappers.add(m);
    });

    result.sources.forEach((s) => {
      apiSchema.sources.add(s);
    });
  }

  parseControllers(list: ControllerJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new ControllerJsonParser(config, texts, writeMethod).build(
      list,
      apiSchema.models.toArray(),
      apiSchema.entities.toArray()
    );

    result.controllers.forEach((c) => {
      apiSchema.controllers.add(c);
    });

    result.entities.forEach((e) => {
      apiSchema.entities.add(e);
    });

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });
  }

  parseRoutes(list: RouteJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new RouteJsonParser(config, texts, writeMethod).build(
      list,
      apiSchema.models.toArray(),
      apiSchema.entities.toArray(),
      apiSchema.controllers.toArray()
    );

    result.routes.forEach((r) => {
      apiSchema.routes.add(r);
    });

    result.route_ios.forEach((r) => {
      apiSchema.route_ios.add(r);
    });

    result.entities.forEach((e) => {
      apiSchema.entities.add(e);
    });

    result.models.forEach((m) => {
      apiSchema.models.add(m);
    });
  }

  build(json: ApiJson): ApiSchema {
    this.parseModels(json.models || []);
    this.parseEntities(json.entities || []);
    this.parseMappers(json.mappers || []);
    this.parseSources(json.sources || []);
    this.parseUseCases(json.use_cases || []);
    this.parseRepositories(json.repositories || []);
    this.parseControllers(json.controllers || []);
    this.parseRoutes(json.routes || []);
    this.parseTools(json.tools || []);

    return this.apiSchema;
  }
}
