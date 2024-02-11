import { ClassJson } from "@cole-framework/cole-cli-core";
import {
  ClassData,
  ElementWithProps,
  ElementWithGenerics,
  ComponentElement,
  Component,
  ElementWithImports,
  ElementWithMethods,
} from "../../../../core";
import { DefaultCliOptions } from "../../common/api.types";

export type NewSourceOptions = DefaultCliOptions & {
  name: string;
  storage: string[];
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
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Source = Component<SourceElement, SourceAddons>;

export type NewSourceJson = {
  sources: SourceJson[];
};
