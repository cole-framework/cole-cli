import {
  ClassJson,
  Component,
  ComponentElement,
  ElementWithGenerics,
  ElementWithProps,
} from "../../../../core";
import { ApiJson, DefaultCliOptions } from "../api.types";

export type NewEntityOptions = DefaultCliOptions & {
  name: string;
  endpoint?: string;
  withModel?: boolean;
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

export type EntityElement = ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type Entity = Component<EntityElement, EntityAddons>;

export type NewEntityJson = ApiJson;
