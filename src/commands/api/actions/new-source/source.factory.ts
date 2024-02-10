import { SourceAddons, SourceData, SourceElement } from "./types";
import { Model } from "../new-model";
import { SourceType } from "../../../../core/type.info";
import { ClassData, ClassSchema, Component, Config } from "../../../../core";
import { nanoid } from "nanoid";
import { WriteMethod } from "@cole-framework/cole-cli-core";

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
    let exp;
    const componentName = config.components.source.generateName(name, {
      type: storage,
    });
    const componentPath = config.components.source.generatePath({
      name,
      type: storage,
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

    if (defaults?.[storage]?.ctor) {
      ctor = defaults[storage].ctor;
    }

    if (Array.isArray(defaults?.[storage]?.inheritance)) {
      inheritance.push(...defaults[storage].inheritance);
    }

    if (Array.isArray(defaults?.[storage]?.imports)) {
      defaults[storage].imports.forEach((i) => {
        i.ref_path = componentPath;
        imports.push(i);
      });
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
      name: componentName,
      props,
      methods,
      interfaces,
      generics,
      inheritance,
      ctor,
      imports,
      exp,
      is_abstract: config.components.source.elementType === "abstract_class",
    };

    const element = ClassSchema.create<SourceElement>(classData, config, {
      addons,
      dependencies,
    });

    const component = Component.create<SourceElement, SourceAddons>(config, {
      id: id || nanoid(),
      type: SourceType.create(componentName, name, storage),
      endpoint,
      path: componentPath,
      writeMethod,
      addons,
      element,
      dependencies,
    });

    return component;
  }
}
