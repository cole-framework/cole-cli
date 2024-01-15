import { nanoid } from "nanoid";
import {
  WriteMethod,
  Component,
  TypeSchema,
  TypeJson,
  Config,
  ModelType,
} from "../../../../core";
import { ModelData, ModelElement, ModelAddons } from "./types";

export class ModelFactory {
  static create(
    data: ModelData,
    writeMethod: WriteMethod,
    config: Config,
    dependencies: Component[]
  ): Component<ModelElement, ModelAddons> {
    const { id, name, type, endpoint, alias } = data;
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
    let exp;

    if (defaults?.common?.exp) {
      exp = defaults.common.exp;
    }

    if (Array.isArray(defaults?.common?.imports)) {
      defaults.common.imports.forEach((i) => {
        i.ref_path = componentPath;
        imports.push(i);
      });
    }

    if (Array.isArray(defaults?.common?.generics)) {
      generics.push(...defaults.common.generics);
    }

    if (Array.isArray(defaults?.common?.props)) {
      props.push(...defaults.common.props);
    }

    if (Array.isArray(defaults?.[type]?.imports)) {
      defaults[type].imports.forEach((i) => {
        i.ref_path = componentPath;
        imports.push(i);
      });
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

    const element = TypeSchema.create<ModelElement>(
      {
        name: componentName,
        type,
        props,
        generics,
        imports,
        alias,
        exp,
      } as TypeJson,
      config.reservedTypes,
      {
        addons,
        dependencies,
      }
    );

    const component = Component.create<ModelElement, ModelAddons>(
      id || nanoid(),
      new ModelType(name, type),
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
