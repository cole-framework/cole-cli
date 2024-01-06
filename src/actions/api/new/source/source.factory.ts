import { SourceAddons, SourceData, SourceElement } from "./types";
import { Model } from "../model";
import { ComponentType } from "../../../../core/type.info";
import {
  ClassData,
  ClassSchema,
  Component,
  Config,
  WriteMethod,
} from "../../../../core";

export class SourceFactory {
  public static create(
    data: SourceData,
    model: Model,
    writeMethod: WriteMethod,
    config: Config
  ): Component<SourceElement, SourceAddons> {
    const dependencies = [model];
    const { id, name, storage, table, endpoint } = data;
    const { defaults } = config.components.source;
    const addons = { storage, table };
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

    if (defaults?.[storage]?.ctor) {
      ctor = defaults[storage].ctor;
    }

    if (defaults?.[storage]?.inheritance) {
      inheritance.push(defaults[storage].inheritance);
    }

    if (Array.isArray(defaults?.[storage]?.imports)) {
      imports.push(...defaults[storage].imports);
    }

    if (Array.isArray(defaults?.[storage]?.interfaces)) {
      imports.push(...defaults[storage].interfaces);
    }

    if (Array.isArray(defaults?.[storage]?.methods)) {
      methods.push(...defaults[storage].methods);
    }

    if (Array.isArray(defaults?.[storage]?.props)) {
      props.push(...defaults[storage].props);
    }

    if (Array.isArray(data.props)) {
      props.push(...data.props);
    }

    if (Array.isArray(defaults?.[storage]?.generics)) {
      generics.push(...defaults[storage].generics);
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

    const componentName = config.components.source.generateName(name, {
      type: storage,
    });
    const componentPath = config.components.source.generatePath({
      name,
      type: storage,
      endpoint,
    }).path;

    const component = Component.create<SourceElement, SourceAddons>(
      id,
      componentName,
      new ComponentType("source", storage),
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
