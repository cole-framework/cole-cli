import { DataContext, RepositoryData, RepositoryElement } from "./types";
import { Entity } from "../entity";
import { RepositoryImplType, TypeInfo } from "../../../../core/type.info";
import {
  AccessType,
  ClassData,
  ClassSchema,
  Component,
  Config,
  WriteMethod,
} from "../../../../core";

export class RepositoryImplFactory {
  static create(
    data: RepositoryData,
    entity: Entity,
    contexts: DataContext[],
    writeMethod: WriteMethod,
    config: Config
  ): Component<RepositoryElement> {
    const dependencies: Component[] = [entity];
    const { id, name, endpoint } = data;
    const { defaults } = config.components.repositoryImpl;
    const addons = { contexts };
    const interfaces = [];
    const methods = [];
    const props = [];
    const generics = [];
    const imports = [];
    let inheritance = [];
    let ctor: any = { params: [], supr: null };

    const componentName = config.components.repositoryImpl.generateName(name);
    const componentPath = config.components.repositoryImpl.generatePath({
      name,
      endpoint,
    }).path;

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

    if (contexts.length > 0) {
      ctor.supr = {
        params: [
          {
            name: "context",
            type: TypeInfo.createFrameworkType("DataContext", [
              entity.element.name,
              contexts[0].model.element.name,
            ]),
            access: AccessType.Protected,
          },
        ],
      };
    }

    for (const context of contexts) {
      const storage = context.model.type.type;
      dependencies.push(context.model);
      ctor.params.push({
        name: storage,
        type: TypeInfo.createFrameworkType("DataContext", [
          entity.element.name,
          context.model.element.name,
        ]),
        access: AccessType.Protected,
      });

      if (Array.isArray(defaults?.[storage]?.inheritance)) {
        inheritance.push(...defaults[storage].inheritance);
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
    };

    const element = ClassSchema.create<RepositoryElement>(
      classData,
      config.reservedTypes,
      {
        addons,
        dependencies,
      }
    );

    const component = Component.create<RepositoryElement>(
      id,
      new RepositoryImplType(name),
      endpoint,
      componentPath,
      writeMethod,
      null,
      element,
      dependencies
    );

    return component;
  }
}
