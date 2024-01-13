import { nanoid } from "nanoid";
import {
  Config,
  WriteMethod,
  Component,
  ClassSchema,
  ClassJson,
  ToolType,
} from "../../../../core";
import { Model } from "../model";
import { ToolData, Tool, ToolElement } from "./types";

export class ToolFactory {
  static create(
    data: ToolData,
    writeMethod: WriteMethod,
    config: Config,
    dependencies: Component[]
  ): Tool {
    const { id, name, endpoint } = data;
    const addons = {};
    const { defaults } = config.components.entity;
    const componentName = config.components.entity.generateName(name);
    const componentPath = config.components.entity.generatePath({
      name,
      endpoint,
    }).path;
    const props = [];
    const methods = [];
    const imports = [];
    const generics = [];
    const inheritance = [];
    let ctor;

    if (defaults?.common.ctor) {
      ctor = defaults.common.ctor;
    }

    if (Array.isArray(defaults?.common?.methods)) {
      methods.push(...defaults.common.methods);
    }

    if (Array.isArray(defaults?.common?.inheritance)) {
      inheritance.push(...defaults.common.inheritance);
    }

    if (Array.isArray(defaults?.common?.props)) {
      props.push(...defaults.common.props);
    }

    if (Array.isArray(data.props)) {
      props.push(...data.props);
    }

    if (Array.isArray(data.methods)) {
      methods.push(...data.methods);
    }

    if (Array.isArray(defaults?.common?.imports)) {
      imports.push(...defaults.common.imports);
    }

    if (Array.isArray(defaults?.common?.generics)) {
      generics.push(...defaults.common.generics);
    }

    const element = ClassSchema.create<ToolElement>(
      {
        name: componentName,
        props,
        methods,
        generics,
        imports,
        ctor,
        inheritance,
      } as ClassJson,
      config.reservedTypes,
      {
        addons,
        dependencies,
      }
    );

    const component = Component.create<ToolElement>(
      id || nanoid(),
      new ToolType(name),
      endpoint,
      componentPath,
      writeMethod,
      addons,
      element,
      dependencies
    );

    return component;
  }
}
