import {
  ClassData,
  ClassSchema,
  Component,
  Config,
  WriteMethod,
} from "../../../../core";

import { RouteIOType, TypeInfo } from "../../../../core/type.info";
import { Model } from "../new-model";
import { RouteData, RouteModel, RouteElement } from "./types";

export class RouteIOFactory {
  public static create(
    data: RouteData,
    input: Model,
    output: Model,
    pathParams: RouteModel,
    queryParams: RouteModel,
    requestBody: RouteModel,
    responseBody: RouteModel,
    writeMethod: WriteMethod,
    config: Config
  ): Component<RouteElement> {
    const dependencies = [];

    [input, output, pathParams, queryParams, requestBody, responseBody].forEach(
      (dep) => {
        if (dep) {
          dependencies.push(dep);
        }
      }
    );

    const {
      id,
      name,
      request: { method },
      endpoint,
    } = data;
    const { defaults } = config.components.routeIO;
    const addons = {};
    const interfaces = [];
    const methods = [];
    const props = [];
    const generics = [];
    const imports = [];
    let inheritance = [];
    let ctor;
    let exp;
    const componentName = config.components.routeIO.generateName(name, {
      type: method,
      method,
    });
    const componentPath = config.components.routeIO.generatePath({
      name,
      type: method,
      method,
      endpoint,
    }).path;

    if (defaults?.common?.exp) {
      exp = defaults.common.exp;
    }

    if (defaults?.common?.ctor) {
      ctor = defaults.common.ctor;
    }

    if (Array.isArray(defaults?.common?.inheritance)) {
      inheritance.push(...defaults.common.inheritance);
    }

    if (Array.isArray(defaults?.common?.imports)) {
      defaults.common.imports.forEach((i) => {
        i.ref_path = componentPath;
        imports.push(i);
      });
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
      defaults[method].imports.forEach((i) => {
        i.ref_path = componentPath;
        imports.push(i);
      });
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
      imports,
      exp,
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
      new RouteIOType(name),
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
