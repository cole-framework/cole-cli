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
import { ApiComponentCollection } from "./api-component-collection";
import { ControllerJsonParser } from "./controller/controller.json-parser";
import { EntityJsonParser } from "./entity/entity.json-parser";
import { MapperJsonParser } from "./mapper/mapper.json-parser";
import { ModelJsonParser } from "./model/model.json-parser";
import { RepositoryJsonParser } from "./repository/repository.json-parser";
import { ApiConfig, ApiJson } from "./api.types";
import { Controller, ControllerJson } from "./controller/types";
import { Entity, EntityJson } from "./entity/types";

export class ApiJsonParser {
  private models = new ApiComponentCollection<Model>();
  private entities = new ApiComponentCollection<Entity>();
  private mappers = new ApiComponentCollection<Mapper>();
  private sources = new ApiComponentCollection<Source>();
  private routes = new ApiComponentCollection<Route>();
  private route_ios = new ApiComponentCollection<RouteIO>();
  private controllers = new ApiComponentCollection<Controller>();
  private use_cases = new ApiComponentCollection<UseCase>();
  private repositories = new ApiComponentCollection<Repository>();
  private repository_impls = new ApiComponentCollection<RepositoryImpl>();
  private repository_factories =
    new ApiComponentCollection<RepositoryFactory>();
  private writeMethod: { component: WriteMethod; dependency: WriteMethod };

  constructor(
    private apiConfig: ApiConfig,
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
    const { models, config, texts, writeMethod } = this;
    const result = new ModelJsonParser(config, texts, writeMethod).build(list);

    result.models.forEach((m) => {
      models.add(m);
    });
  }

  parseEntities(list: EntityJson[]) {
    const { models, entities, config, texts, writeMethod } = this;
    const result = new EntityJsonParser(config, texts, writeMethod).build(
      list,
      models.toArray()
    );

    result.entities.forEach((e) => {
      entities.add(e);
    });

    result.models.forEach((m) => {
      models.add(m);
    });
  }

  parseMappers(list: MapperJson[]) {
    const { models, entities, mappers, config, texts, writeMethod } = this;
    const result = new MapperJsonParser(config, texts, writeMethod).build(
      list,
      entities.toArray(),
      models.toArray()
    );

    result.mappers.forEach((m) => {
      mappers.add(m);
    });

    result.entities.forEach((e) => {
      entities.add(e);
    });

    result.models.forEach((m) => {
      models.add(m);
    });
  }

  parseSources(list: SourceJson[]) {
    const { models, sources, entities, config, texts, writeMethod } = this;
    const result = new SourceJsonParser(config, texts, writeMethod).build(
      list,
      models.toArray()
    );

    result.sources.forEach((s) => {
      sources.add(s);
    });

    result.entities.forEach((e) => {
      entities.add(e);
    });

    result.models.forEach((m) => {
      models.add(m);
    });
  }

  parseUseCases(list: UseCaseJson[]) {
    const { models, entities, use_cases, config, texts, writeMethod } = this;
    const result = new UseCaseJsonParse(config, texts, writeMethod).build(
      list,
      models.toArray(),
      entities.toArray()
    );

    result.use_cases.forEach((u) => {
      use_cases.add(u);
    });

    result.entities.forEach((e) => {
      entities.add(e);
    });

    result.models.forEach((m) => {
      models.add(m);
    });
  }

  parseRepositories(list: RepositoryJson[]) {
    const {
      models,
      entities,
      mappers,
      sources,
      repositories,
      repository_impls,
      repository_factories,
      config,
      texts,
      writeMethod,
    } = this;
    const result = new RepositoryJsonParser(config, texts, writeMethod).build(
      list,
      entities.toArray(),
      models.toArray(),
      mappers.toArray(),
      sources.toArray()
    );

    result.repositories.forEach((u) => {
      repositories.add(u);
    });

    result.repository_impls.forEach((u) => {
      repository_impls.add(u);
    });

    result.repository_factories.forEach((f) => {
      repository_factories.add(f);
    });

    result.entities.forEach((e) => {
      entities.add(e);
    });

    result.models.forEach((m) => {
      models.add(m);
    });

    result.mappers.forEach((m) => {
      mappers.add(m);
    });

    result.sources.forEach((s) => {
      sources.add(s);
    });
  }

  parseControllers(list: ControllerJson[]) {
    const { models, controllers, entities, config, texts, writeMethod } = this;
    const result = new ControllerJsonParser(config, texts, writeMethod).build(
      list,
      models.toArray(),
      entities.toArray()
    );

    result.controllers.forEach((c) => {
      controllers.add(c);
    });

    result.entities.forEach((e) => {
      entities.add(e);
    });

    result.models.forEach((m) => {
      models.add(m);
    });
  }

  parseRoutes(list: RouteJson[]) {
    const {
      models,
      controllers,
      routes,
      route_ios,
      entities,
      config,
      texts,
      writeMethod,
    } = this;
    const result = new RouteJsonParser(config, texts, writeMethod).build(
      list,
      models.toArray(),
      entities.toArray(),
      controllers.toArray()
    );

    result.routes.forEach((r) => {
      routes.add(r);
    });

    result.route_ios.forEach((r) => {
      route_ios.add(r);
    });

    result.entities.forEach((e) => {
      entities.add(e);
    });

    result.models.forEach((m) => {
      models.add(m);
    });
  }

  build(json: ApiJson) {
    const {
      models,
      entities,
      mappers,
      sources,
      controllers,
      routes,
      route_ios,
      use_cases,
      repositories,
      repository_impls,
      repository_factories,
    } = this;

    this.parseModels(json.models || []);
    this.parseEntities(json.entities || []);
    this.parseMappers(json.mappers || []);
    this.parseSources(json.sources || []);
    this.parseUseCases(json.use_cases || []);
    this.parseRepositories(json.repositories || []);
    this.parseControllers(json.controllers || []);
    this.parseRoutes(json.routes || []);

    return {
      controllers: controllers.toArray().map((i) => i.toObject()),
      models: models.toArray().map((i) => i.toObject()),
      entities: entities.toArray().map((i) => i.toObject()),
      mappers: mappers.toArray().map((i) => i.toObject()),
      sources: sources.toArray().map((i) => i.toObject()),
      routes: routes.toArray().map((i) => i.toObject()),
      route_ios: route_ios.toArray().map((i) => i.toObject()),
      use_cases: use_cases.toArray().map((i) => i.toObject()),
      repositories: repositories.toArray().map((i) => i.toObject()),
      repository_impls: repository_impls.toArray().map((i) => i.toObject()),
      repository_factories: repository_factories
        .toArray()
        .map((i) => i.toObject()),
    };
  }
}
