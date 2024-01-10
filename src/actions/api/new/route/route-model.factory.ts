import { nanoid } from "nanoid";
import { RouteModelAddons, RouteModelData, RouteModelElement } from "./types";
import {
  Config,
  WriteMethod,
  Component,
  TypeSchema,
  TypeJson,
  RouteModelLabel,
  RouteModelType,
} from "../../../../core";

export class RouteModelFactory {
  static create(
    data: RouteModelData,
    writeMethod: WriteMethod,
    config: Config,
    dependencies: Component[]
  ): Component<RouteModelElement, RouteModelAddons> {
    const { method, name, type, endpoint } = data;
    const addons = { modelType: type };
    const { defaults } = config.components.routeModel;
    const componentName = config.components.routeModel.generateName(name, {
      type,
      method,
    });

    const componentPath = config.components.routeModel.generatePath({
      name,
      type,
      method,
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
        name: componentName,
        type,
        props,
        generics,
      } as TypeJson,
      config.reservedTypes,
      {
        addons,
        dependencies
      }
    );

    const component = Component.create<RouteModelElement, RouteModelAddons>(
      nanoid(),
      new RouteModelType(name, type),
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
