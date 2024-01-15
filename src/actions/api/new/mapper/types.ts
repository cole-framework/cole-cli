import {
  ClassData,
  ClassJson,
  Component,
  ComponentElement,
  ElementWithGenerics,
  ElementWithImports,
  ElementWithProps,
} from "../../../../core";
import { DefaultCliOptions } from "../api.types";
import { EntityJson } from "../entity";
import { ModelJson } from "../model";

export type NewMapperOptions = DefaultCliOptions & {
  name: string;
  endpoint?: string;
  storage?: string[];
  model?: string;
  entity?: string;
};

export type MapperJson = ClassJson & {
  id?: string;
  name: string;
  storages: string[];
  endpoint?: string;
  model?: string;
  entity?: string;
};

export type MapperData = ClassData & {
  id?: string;
  name: string;
  storage: string;
  endpoint?: string;
};

export type MapperAddons = {
  storage: string;
};

export type MapperElement = ElementWithImports &
  ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type Mapper = Component<MapperElement, MapperAddons>;

export type NewMapperJson = {
  mappers: MapperJson[];
  entities?: EntityJson[];
  models?: ModelJson[];
};
