import { ControllerJson } from "../actions/new-controller/types";
import { EntityJson } from "../actions/new-entity/types";
import { MapperJson } from "../actions/new-mapper";
import { ModelJson } from "../actions/new-model";
import { RepositoryJson } from "../actions/new-repository";
import { RouteJson } from "../actions/new-route";
import { SourceJson } from "../actions/new-source";
import { ToolsetJson } from "../actions/new-toolset";
import { UseCaseJson } from "../actions/new-use-case";

export type DefaultCliOptions = {
  skipTests?: boolean;
  withDeps?: boolean;
  force?: boolean;
  patch?: boolean;
  json?: string;
  [key: string]: any;
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
