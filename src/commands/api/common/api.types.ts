import { ComponentData } from "../../../core";
import { ControllerJson } from "../actions/new-controller/types";
import { EntityJson } from "../actions/new-entity/types";
import { MapperJson } from "../actions/new-mapper";
import { ModelJson } from "../actions/new-model";
import { RepositoryJson } from "../actions/new-repository";
import { RouteJson } from "../actions/new-route";
import { SourceJson } from "../actions/new-source";
import { ToolsetJson } from "../actions/new-toolset";

import { UseCaseJson } from "../actions/new-use-case";
import { ApiConfig } from "./api.config";

export type DefaultCliOptions = {
  skipTests?: boolean;
  withDeps?: boolean;
  force?: boolean;
  patch?: boolean;
  json?: string;
  [key: string]: unknown;
};

export type ApiJson = {
  models?: ModelJson[];
  entities?: EntityJson[];
  mappers?: MapperJson[];
  sources?: SourceJson[];
  use_cases?: UseCaseJson[];
  repositories?: RepositoryJson[];
  routes?: RouteJson[];
  controllers?: ControllerJson[];
  toolsets?: ToolsetJson[];
};

export type ApiObject = {
  controllers: ComponentData[];
  models: ComponentData[];
  entities: ComponentData[];
  mappers: ComponentData[];
  sources: ComponentData[];
  routes: ComponentData[];
  route_ios: ComponentData[];
  use_cases: ComponentData[];
  repositories: ComponentData[];
  repository_impls: ComponentData[];
  repository_factories: ComponentData[];
  toolsets: ComponentData[];
};

export type ApiData = {
  config: ApiConfig;
  components: any[];
};
