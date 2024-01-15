import {
  ClassJson,
  ClassData,
  ElementWithProps,
  ElementWithGenerics,
  ComponentElement,
  Component,
  ElementWithImports,
} from "../../../../core";
import { DefaultCliOptions } from "../api.types";

export type NewSourceOptions = DefaultCliOptions & {
  name: string;
  type: string[];
  table: string;
  endpoint?: string;
  model?: string;
};

export type SourceJson = ClassJson & {
  id?: string;
  name: string;
  storages: string[];
  table?: string;
  endpoint?: string;
  model?: string;
};

export type SourceData = ClassData & {
  name: string;
  table: string;
  storage: string;
  endpoint?: string;
};

export type SourceAddons = {
  storage: string;
  table: string;
};

export type SourceElement = ElementWithImports &
  ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type Source = Component<SourceElement, SourceAddons>;

export type NewSourceJson = {
  sources: SourceJson[];
};
