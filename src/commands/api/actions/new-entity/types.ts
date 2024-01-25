import {
  ClassJson,
  Component,
  ComponentElement,
  ElementWithGenerics,
  ElementWithImports,
  ElementWithProps,
} from "../../../../core";
import { ApiJson, DefaultCliOptions } from "../../common/api.types";

export type NewEntityOptions = DefaultCliOptions & {
  name: string;
  endpoint?: string;
  model?: boolean;
  props?: string[];
};

export type EntityJson = ClassJson & {
  endpoint?: string;
  has_model?: boolean;
};

export type EntityData = EntityJson;

export type EntityAddons = {
  hasModel: boolean;
};

export type EntityElement = ElementWithImports &
  ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type Entity = Component<EntityElement, EntityAddons>;

export type NewEntityJson = ApiJson;
