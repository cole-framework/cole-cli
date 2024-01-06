import { nanoid } from "nanoid";
import {
  WriteMethod,
  Component,
  TypeSchema,
  TypeJson,
  ComponentType,
  Config,
} from "../../../../core";
import { ModelData, ModelElement, ModelAddons } from "./types";

export class ModelFactory {
  static create(
    data: ModelData,
    writeMethod: WriteMethod,
    config: Config,
    dependencies?: Component[]
  ): Component<ModelElement, ModelAddons> {
    const deps = Array.isArray(dependencies) ? [...dependencies] : [];
    const { id, name, type, endpoint } = data;
    const addons = { modelType: type };
    const { defaults } = config.components.model;
    const componentName = config.components.model.generateName(name, {
      type,
    });

    const componentPath = config.components.model.generatePath({
      name,
      type,
      endpoint,
    }).path;
    const imports = [];
    const props = [];
    const generics = [];

    if (Array.isArray(defaults?.common?.imports)) {
      imports.push(...defaults.common.imports);
    }

    if (Array.isArray(defaults?.common?.generics)) {
      generics.push(...defaults.common.generics);
    }

    if (Array.isArray(defaults?.common?.props)) {
      props.push(...defaults.common.props);
    }

    if (Array.isArray(defaults?.[type]?.imports)) {
      imports.push(...defaults[type].imports);
    }

    if (Array.isArray(defaults?.[type]?.generics)) {
      generics.push(...defaults[type].generics);
    }

    if (Array.isArray(defaults?.[type]?.props)) {
      props.push(...defaults[type].props);
    }

    if (Array.isArray(data.generics)) {
      generics.push(...data.generics);
    }

    if (Array.isArray(data.props)) {
      props.push(...data.props);
    }

    const element = TypeSchema.create(
      {
        name,
        type,
        props,
        generics,
      } as TypeJson,
      config.reservedTypes,
      deps,
      addons
    );

    const component = Component.create<ModelElement, ModelAddons>(
      id || nanoid(),
      componentName,
      new ComponentType("model", type),
      endpoint,
      componentPath,
      writeMethod,
      addons,
      element,
      deps
    );

    return component;
  }
}
