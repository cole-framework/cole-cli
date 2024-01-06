import { RepositoryData, RepositoryElement } from "./types";
import { Entity } from "../entity";
import { ComponentType } from "../../../../core/type.info";
import {
  ClassData,
  ClassSchema,
  Component,
  Config,
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

    if (defaults?.common?.inheritance) {
      inheritance.push(defaults.common?.inheritance);
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
      name,
      props,
      methods,
      interfaces,
      generics,
      inheritance,
    };

    const element = ClassSchema.create(
      classData,
      config.reservedTypes,
      dependencies,
      addons
    );

    const componentName = config.components.repository.generateName(name);
    const componentPath = config.components.repository.generatePath({
      name,
      endpoint,
    }).path;

    const component = Component.create<RepositoryElement>(
      id,
      componentName,
      new ComponentType("repository"),
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
