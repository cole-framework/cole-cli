import {
  ClassData,
  ClassSchema,
  Component,
  Config,
  WriteMethod,
} from "../../../../core";

import { ComponentType, TypeInfo } from "../../../../core/type.info";
import { RouteData, RouteModel, RouteElement } from "./types";

export class RouteIOFactory {
  public static create(
    data: RouteData,
    input: TypeInfo,
    output: TypeInfo,
    pathParams: RouteModel,
    queryParams: RouteModel,
    requestBody: string | RouteModel,
    responseBody: string | RouteModel,
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
    const { defaults } = config.components.routeIO;
    const addons = {
      input: input?.name,
      output: output?.name,
      path_params: pathParams?.name,
      query_params: queryParams?.name,
      request_body:
        typeof requestBody === "string" ? requestBody : requestBody?.name,
      response_body:
        typeof responseBody === "string" ? responseBody : responseBody?.name,
    };
    const interfaces = [];
    const methods = [];
    const props = [];
    const generics = [];
    const imports = [];
    let inheritance = [];
    let ctor;

    if (defaults?.common?.ctor) {
      ctor = defaults.common.ctor;
    }

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

    if (defaults?.[method]?.inheritance) {
      inheritance.push(defaults[method].inheritance);
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
      name,
      props,
      methods,
      interfaces,
      generics,
      inheritance,
      ctor,
    };

    const element = ClassSchema.create(
      classData,
      config.reservedTypes,
      dependencies,
      addons
    );

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

    const component = Component.create<RouteElement>(
      id,
      componentName,
      new ComponentType("route_io"),
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
