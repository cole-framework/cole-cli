import {
  ClassJson,
  Component,
  ComponentElement,
  ElementWithGenerics,
  ElementWithMethods,
  ElementWithProps,
} from "../../../../core";
import { ApiJson, DefaultCliOptions } from "../api.types";

export type NewToolOptions = DefaultCliOptions & {
  name: string;
  endpoint?: string;
};

export type ToolJson = ClassJson & {
  endpoint?: string;
};

export type ToolData = ToolJson;

export type ToolElement = ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Tool = Component<ToolElement>;

export type NewToolJson = ApiJson;
