import { ComponentData, WriteMethod } from "../../../core";
import { ControllerElement, ControllerJson } from "./controller/types";
import { EntityAddons, EntityElement, EntityJson } from "./entity/types";
import { MapperAddons, MapperElement, MapperJson } from "./mapper";
import { ModelAddons, ModelElement, ModelJson } from "./model";
import { RepositoryElement, RepositoryJson } from "./repository";
import { RouteElement, RouteJson } from "./route";
import { SourceAddons, SourceElement, SourceJson } from "./source";
import { UseCaseElement, UseCaseJson } from "./use-case";

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
};

export type ApiData = {
  config: ApiConfig;
  components: any[];
};

export type ApiConfig = {
  skip_tests: boolean;
  with_dependencies: boolean;
  use_cwd: boolean;
  force: boolean;
  write_method: WriteMethod;
};
