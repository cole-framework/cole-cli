import {
  ClassJson,
  Component,
  ComponentElement,
  ElementWithMethods,
  ElementWithProps,
} from "../../../../core";
import { DefaultCliOptions } from "../api.types";

export type NewControllerOptions = DefaultCliOptions & {
  endpoint?: string;
  name?: string;
  handlers: string[];
};

export type HandlerJson = {
  name: string;
  input?: any;
  output?: any;
};

export type ControllerJson = ClassJson & {
  name: string;
  endpoint?: string;
  handlers?: HandlerJson[];
};

export type ControllerData = ClassJson & {
  name: string;
  endpoint?: string;
  handlers?: {
    name: string;
    input?: string;
    output?: string;
  }[];
};

export type ControllerElement = ElementWithProps &
  ElementWithMethods &
  ComponentElement<any>;

export type Controller = Component<ControllerElement>;
