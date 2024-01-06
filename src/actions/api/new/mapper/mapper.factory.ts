import { MapperAddons, MapperData, MapperElement } from "./types";
import { Entity } from "../entity";
import { Model } from "../model";
import { ComponentType } from "../../../../core/type.info";
import {
  WriteMethod,
  Component,
  ClassData,
  ClassSchema,
  Config,
} from "../../../../core";

export class MapperFactory {
  static create(
    data: MapperData,
    entity: Entity,
    model: Model,
    writeMethod: WriteMethod,
    config: Config
  ): Component<MapperElement, MapperAddons> {
    const dependencies = [model, entity];
    const { id, name, storage, endpoint } = data;
    const { defaults } = config.components.mapper;
    const addons = { storage };
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

    if (Array.isArray(data.methods)) {
      methods.push(...data.methods);
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
    };

    const element = ClassSchema.create(
      classData,
      config.reservedTypes,
      dependencies,
      addons
    );

    const componentName = config.components.mapper.generateName(name, {
      type: storage,
    });
    const componentPath = config.components.mapper.generatePath({
      name,
      type: storage,
      endpoint,
    }).path;

    const component = Component.create<MapperElement, MapperAddons>(
      id,
      componentName,
      new ComponentType("mapper", storage),
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
