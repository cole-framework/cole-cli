import {
  Component,
  ComponentElement,
  ElementWithGenerics,
  ElementWithProps,
  GenericJson,
  PropJson,
} from "../../../../core";
import { ApiJson, DefaultCliOptions } from "../api.types";

export type NewEntityOptions = DefaultCliOptions & {
  name: string;
  endpoint?: string;
  withModel?: boolean;
  props?: string[];
};

export type EntityJson = {
  id?: string;
  name: string;
  endpoint?: string;
  has_model?: boolean;
  props?: (PropJson | string)[];
  generics?: GenericJson[];
};

export type EntityData = EntityJson;

export type EntityAddons = {
  hasModel: boolean;
};

export type EntityElement = ElementWithProps &
  ElementWithGenerics &
  ComponentElement<any>;

export type Entity = Component<EntityElement, EntityAddons>;

export type NewEntityJson = ApiJson;
