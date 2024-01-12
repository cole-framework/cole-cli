import {
  WriteMethod,
  Config,
  Component,
  ClassData,
  ClassSchema,
  RouteType,
} from "../../../../core";
import { RouteData, RouteIO, RouteElement } from "./types";

export class RouteFactory {
  public static create(
    data: RouteData,
    io: RouteIO,
    writeMethod: WriteMethod,
    config: Config
  ): Component<RouteElement> {
    const dependencies = [];
    const {
      id,
      name,
      request: { method },
      endpoint,
    } = data;
    const { defaults } = config.components.route;
    const addons: { path: string } = {
      path: data.request.path,
    };
    const interfaces = [];
    const methods = [];
    const props = [];
    const generics = [];
    const imports = [];
    let inheritance = [];
    let ctor;

    const componentName = config.components.route.generateName(name, {
      type: method,
      method,
    });

    const componentPath = config.components.route.generatePath({
      name,
      type: method,
      method,
      endpoint,
    }).path;

    if (io) {
      dependencies.push(io);
    }

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

    if (Array.isArray(defaults?.[method]?.inheritance)) {
      inheritance.push(...defaults[method].inheritance);
    }

    if (Array.isArray(defaults?.[method]?.imports)) {
      imports.push(...defaults[method].imports);
    }

    if (Array.isArray(defaults?.[method]?.interfaces)) {
      imports.push(...defaults[method].interfaces);
    }

    if (Array.isArray(defaults?.[method]?.methods)) {
      methods.push(...defaults[method].methods);
    }

    if (Array.isArray(defaults?.[method]?.props)) {
      props.push(...defaults[method].props);
    }

    if (Array.isArray(data.props)) {
      props.push(...data.props);
    }

    if (Array.isArray(data.methods)) {
      methods.push(...data.methods);
    }

    if (Array.isArray(defaults?.[method]?.generics)) {
      generics.push(...defaults[method].generics);
    }

    const classData: ClassData = {
      id,
      name: componentName,
      props,
      methods,
      interfaces,
      generics,
      inheritance,
      ctor,
    };

    const element = ClassSchema.create<RouteElement>(
      classData,
      config.reservedTypes,
      {
        addons,
        dependencies,
      }
    );

    const component = Component.create<RouteElement>(
      id,
      new RouteType(name, method),
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
