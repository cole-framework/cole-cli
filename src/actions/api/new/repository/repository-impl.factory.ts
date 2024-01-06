import { DataContext, RepositoryData, RepositoryElement } from "./types";
import { Entity } from "../entity";
import { ComponentType, TypeInfo } from "../../../../core/type.info";
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
    let ctor = { params: [], supr: null };

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

    console.log("-----", contexts);

    if (contexts.length > 0) {
      ctor.supr = {
        params: [
          {
            name: "context",
            type: TypeInfo.createFrameworkType("DataContext", [
              entity.name,
              contexts[0].model.name,
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
          entity.name,
          context.model.name,
        ]),
        access: AccessType.Protected,
      });

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

    const componentName = config.components.repositoryImpl.generateName(name);
    const componentPath = config.components.repositoryImpl.generatePath({
      name,
      endpoint,
    }).path;

    const component = Component.create<RepositoryElement>(
      id,
      componentName,
      new ComponentType("repository_impl"),
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
