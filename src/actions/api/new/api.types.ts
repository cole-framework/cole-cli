import { WriteMethod } from "../../../core";
import { ControllerJson } from "./controller/types";
import { EntityJson } from "./entity/types";
import { MapperJson } from "./mapper";
import { ModelJson } from "./model";
import { RepositoryJson } from "./repository";
import { RouteJson } from "./route";
import { SourceJson } from "./source";
import { UseCaseJson } from "./use-case";

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
