import {
  WriteMethod,
  Component,
  ClassData,
  ClassSchema,
  ComponentType,
  Config,
} from "../../../../core";
import { ControllerData, ControllerElement } from "./types";

export class ControllerFactory {
  public static create(
    data: ControllerData,
    writeMethod: WriteMethod,
    config: Config,
    dependencies?: Component[]
  ): Component<ControllerElement> {
    const { id, name, endpoint } = data;
    const { defaults } = config.components.controller;

    const interfaces = [];
    const methods = [];
    const props = [];
    const generics = [];
    const imports = [];
    let inheritance = [];
    let ctor;

    if (defaults?.common?.ctor) {
      ctor = defaults.common.ctor;
    }

    if (defaults?.common?.inheritance) {
      inheritance.push(defaults.common.inheritance);
    }

    if (Array.isArray(defaults?.common?.imports)) {
      imports.push(...defaults.common.imports);
    }

    if (Array.isArray(defaults?.common?.interfaces)) {
      imports.push(...defaults.common.interfaces);
    }

    if (Array.isArray(defaults?.common?.methods)) {
      methods.push(...defaults.common.methods);
    }

    if (Array.isArray(defaults?.common?.props)) {
      props.push(...defaults.common.props);
    }

    if (Array.isArray(defaults?.common?.generics)) {
      generics.push(...defaults.common.generics);
    }

    if (Array.isArray(data.props)) {
      props.push(...data.props);
    }

    if (Array.isArray(data.methods)) {
      methods.push(...data.methods);
    }

    if (Array.isArray(data.handlers)) {
      data.handlers.forEach((handler) => {
        if (typeof handler === "string") {
          methods.push(handler);
        } else {
          const params = [];

          if (typeof handler.input === "string") {
            params.push({ name: "input", type: handler.input });
          }

          methods.push({
            name: handler.name,
            params,
            return_type: handler.output,
          });
        }
      });
    }

    const classData: ClassData = {
      id,
      name,
      props,
      methods,
      interfaces,
      generics,
      inheritance,
      ctor,
    };

    const element = ClassSchema.create(
      classData,
      config.reservedTypes,
      dependencies
    );

    const componentName = config.components.controller.generateName(name);
    const componentPath = config.components.controller.generatePath({
      name,
      endpoint,
    }).path;

    const component = Component.create<ControllerElement>(
      id,
      componentName,
      new ComponentType("controller"),
      endpoint,
      componentPath,
      writeMethod,
      null,
      element,
      dependencies
    );

    return component;
  }
}
