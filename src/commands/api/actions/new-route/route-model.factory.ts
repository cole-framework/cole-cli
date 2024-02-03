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
    const { method, name, type, endpoint, alias } = data;
    const addons = { modelType: type };
    const { defaults } = config.components.routeModel;
    const componentName = config.components.routeModel.generateName(name, {
      type,
      method,
    });
    const typeLC = type?.toLowerCase() || "json";
    const methodLC = method?.toLowerCase() || "";
    const componentPath = config.components.routeModel.generatePath({
      name,
      type: typeLC,
      method: methodLC,
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

    if (Array.isArray(defaults?.[methodLC]?.imports)) {
      defaults[methodLC].imports.forEach((i) => {
        i.ref_path = componentPath;
        imports.push(i);
      });
    }

    if (Array.isArray(defaults?.[methodLC]?.generics)) {
      generics.push(...defaults[methodLC].generics);
    }

    if (Array.isArray(defaults?.[methodLC]?.props)) {
      props.push(...defaults[methodLC].props);
    }

    if (Array.isArray(data.generics)) {
      generics.push(...data.generics);
    }

    if (Array.isArray(data.props)) {
      props.push(...data.props);
    }

    const element = TypeSchema.create<RouteModelElement>(
      {
        name: componentName,
        type: typeLC,
        props,
        generics,
        exp,
        alias,
      } as TypeJson,
      config,
      {
        addons,
        dependencies,
      }
    );

    const component = Component.create<RouteModelElement, RouteModelAddons>(
      config,
      {
        id: nanoid(),
        type: RouteModelType.create(componentName, name, method, type),
        endpoint,
        path: componentPath,
        writeMethod,
        addons,
        element,
        dependencies,
      }
    );

    return component;
  }
}
