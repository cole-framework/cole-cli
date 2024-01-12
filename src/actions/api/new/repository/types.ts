import {
  ClassJson,
  ClassData,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "../../../../core";
import { DefaultCliOptions } from "../api.types";
import { EntityJson } from "../entity";
import { MapperJson, Mapper } from "../mapper";
import { ModelJson, Model } from "../model";
import { SourceJson, Source } from "../source";

export type NewRepositoryOptions = DefaultCliOptions & {
  name: string;
  endpoint?: string;
  storage?: string[];
  impl?: boolean;
  interface?: boolean;
  factory?: boolean;
  bundle?: boolean;
  entity?: string;
  model?: string;
};

export type DataContextJson = {
  type: string;
  model: string;
  source?: string;
  mapper?: string;
};

export type RepositoryJson = ClassJson & {
  name: string;
  entity: string;
  build_interface?: boolean;
  use_default_impl?: boolean;
  build_factory?: boolean;
  endpoint?: string;
  contexts?: (DataContextJson | string)[];
};

export type RepositoryData = ClassData & {
  endpoint?: string;
};

export type NewRepositoryJson = {
  repositories: RepositoryJson[];
  models?: ModelJson[];
  entities?: EntityJson[];
  sources?: SourceJson[];
  mappers?: MapperJson[];
};

export type RepositoryElement = ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Repository = Component<RepositoryElement>;
export type RepositoryImpl = Component<RepositoryElement>;
export type RepositoryFactory = Component<RepositoryElement>;

export type DataContext = {
  model: Model;
  source?: Source;
  mapper?: Mapper;
};
