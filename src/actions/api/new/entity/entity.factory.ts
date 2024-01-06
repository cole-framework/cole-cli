import { nanoid } from "nanoid";
import {
  Config,
  WriteMethod,
  Component,
  ClassSchema,
  ClassJson,
  ComponentType,
} from "../../../../core";
import { Model } from "../model";
import { EntityData, Entity, EntityElement, EntityAddons } from "./types";

export class EntityFactory {
  static create(
    data: EntityData,
    model: Model,
    writeMethod: WriteMethod,
    config: Config,
    dependencies?: Component[]
  ): Entity {
    const deps: Component[] = Array.isArray(dependencies)
      ? [...dependencies]
      : [];

    const { id, name, endpoint } = data;
    const addons = { hasModel: !!model };
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

    if (Array.isArray(defaults?.common?.methods)) {
      defaults.common.methods.forEach((method) => {
        if (
          (model && method.meta.includes("is#to_model_method")) ||
          !method.meta
        ) {
          methods.push(method);
        }
      });
    }

    if (Array.isArray(defaults?.common?.props)) {
      props.push(...defaults.common.props);
    }

    if (Array.isArray(data.props)) {
      props.push(...data.props);
    }

    if (Array.isArray(defaults?.common?.imports)) {
      imports.push(...defaults.common.imports);
    }

    if (Array.isArray(defaults?.common?.generics)) {
      generics.push(...defaults.common.generics);
    }

    const element = ClassSchema.create(
      {
        name,
        props,
        methods,
        generics,
        imports,
      } as ClassJson,
      config.reservedTypes,
      deps,
      addons
    );

    const component = Component.create<EntityElement, EntityAddons>(
      id || nanoid(),
      componentName,
      new ComponentType("entity"),
      endpoint,
      componentPath,
      writeMethod,
      addons,
      element,
      deps
    );

    if (model) {
      component.addDependency(model);
    }

    return component;
  }
}
