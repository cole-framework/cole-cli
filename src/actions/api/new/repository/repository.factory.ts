import { RepositoryData, RepositoryElement } from "./types";
import { Entity } from "../entity";
import {
  ClassData,
  ClassSchema,
  Component,
  Config,
  RepositoryType,
  WriteMethod,
} from "../../../../core";

export class RepositoryComponentFactory {
  static create(
    data: RepositoryData,
    entity: Entity,
    writeMethod: WriteMethod,
    config: Config
  ): Component<RepositoryElement> {
    const dependencies = [entity];
    const { id, name, endpoint } = data;
    const { defaults } = config.components.repository;
    const addons = {};
    const interfaces = [];
    const methods = [];
    const props = [];
    const generics = [];
    const imports = [];
    let inheritance = [];
    let ctor;

    const componentName = config.components.repository.generateName(name);
    const componentPath = config.components.repository.generatePath({
      name,
      endpoint,
    }).path;

    if (defaults?.common?.ctor) {
      ctor = defaults.common.ctor;
    }

    if (Array.isArray(defaults?.common?.inheritance)) {
      inheritance.push(...defaults.common.inheritance);
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

    const classData: ClassData = {
      id,
      name: componentName,
      props,
      methods,
      interfaces,
      generics,
      inheritance,
      imports,
      ctor,
    };

    const element = ClassSchema.create<RepositoryElement>(
      classData,
      config.reservedTypes,
      {
        addons,
        dependencies,
      }
    );

    const component = Component.create<RepositoryElement>(
      id,
      new RepositoryType(name),
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
