import { MapperJson } from "../actions/new-mapper";
import { RepositoryJson } from "../actions/new-repository";
import { RouteJsonParser, RouteJson } from "../actions/new-route";
import { ModelJson } from "../actions/new-model";
import { SourceJsonParser, SourceJson } from "../actions/new-source";
import { UseCaseJsonParse, UseCaseJson } from "../actions/new-use-case";
import { Config, Texts, WriteMethod } from "../../../core";
import { ApiSchema } from "./api.schema";
import { ControllerJsonParser } from "../actions/new-controller/controller.json-parser";
import { EntityJsonParser } from "../actions/new-entity/entity.json-parser";
import { MapperJsonParser } from "../actions/new-mapper/mapper.json-parser";
import { ModelJsonParser } from "../actions/new-model/model.json-parser";
import { RepositoryJsonParser } from "../actions/new-repository/repository.json-parser";
import { ApiJson } from "./api.types";
import { ControllerJson } from "../actions/new-controller/types";
import { EntityJson } from "../actions/new-entity/types";
import { ApiConfig } from "./api.config";
import { ToolsetJson, ToolsetJsonParser } from "../actions/new-toolset";

export class ApiJsonParser {
  private apiSchema = new ApiSchema();
  private writeMethod: { component: WriteMethod; dependency: WriteMethod };

  constructor(
    apiConfig: ApiConfig,
    private config: Config,
    private texts: Texts
  ) {
    this.writeMethod = {
      component: apiConfig.write_method,
      dependency: apiConfig.dependencies_write_method,
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

  parseTools(list: ToolsetJson[]) {
    const { apiSchema, config, texts, writeMethod } = this;
    const result = new ToolsetJsonParser(config, texts, writeMethod).build(
      list,
      apiSchema.models.toArray(),
      apiSchema.entities.toArray()
    );

    result.toolsets.forEach((t) => {
      apiSchema.toolsets.add(t);
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
    // console.log("JSON", JSON.stringify(json, null, 2));

    this.parseModels(json.models || []);
    this.parseEntities(json.entities || []);
    this.parseMappers(json.mappers || []);
    this.parseSources(json.sources || []);
    this.parseUseCases(json.use_cases || []);
    this.parseRepositories(json.repositories || []);
    this.parseControllers(json.controllers || []);
    this.parseRoutes(json.routes || []);
    this.parseTools(json.toolsets || []);

    return this.apiSchema;
  }
}
