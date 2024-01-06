import { UseCaseData, UseCaseElement } from "./types";
import { ComponentType } from "../../../../core/type.info";
import {
  ClassData,
  ClassSchema,
  Component,
  Config,
  WriteMethod,
} from "../../../../core";

export class UseCaseFactory {
  public static create(
    data: UseCaseData,
    writeMethod: WriteMethod,
    config: Config
  ): Component<UseCaseElement> {
    const { id, name, input, output, endpoint } = data;
    const { defaults } = config.components.useCase;
    const addons = { input, output };
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
      inheritance.push(defaults.common.inheritance);
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

    if (Array.isArray(data.props)) {
      props.push(...data.props);
    }

    if (Array.isArray(data.methods)) {
      methods.push(...data.methods);
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
      [],
      addons
    );

    const componentName = config.components.useCase.generateName(name);
    const componentPath = config.components.useCase.generatePath({
      name,
      endpoint,
    }).path;

    const component = Component.create<UseCaseElement>(
      id,
      componentName,
      new ComponentType("use_case"),
      endpoint,
      componentPath,
      writeMethod,
      null,
      element,
      []
    );

    return component;
  }
}
