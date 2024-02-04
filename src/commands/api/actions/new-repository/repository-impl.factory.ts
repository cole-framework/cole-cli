import {
  DataContext,
  Repository,
  RepositoryData,
  RepositoryElement,
} from "./types";
import { Entity } from "../new-entity";
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
    repository: Repository,
    contexts: DataContext[],
    writeMethod: WriteMethod,
    config: Config
  ): Component<RepositoryElement> {
    const dependencies: Component[] = [entity, repository];
    const { id, name, endpoint } = data;
    const { defaults } = config.components.repositoryImpl;
    const addons = {};
    const interfaces = [];
    const methods = [];
    const props = [];
    const generics = [];
    const imports = [];
    let inheritance = [];
    let ctor: any = { params: [], supr: null };
    let exp;

    const componentName = config.components.repositoryImpl.generateName(name);
    const componentPath = config.components.repositoryImpl.generatePath({
      name,
      endpoint,
    }).path;

    if (defaults?.common?.exp) {
      exp = defaults.common.exp;
    }

    if (defaults?.common?.ctor) {
      if (Array.isArray(defaults.common.ctor.params)) {
        ctor.params.push(...defaults.common.ctor.params);
      }
      if (defaults.common.ctor.supr) {
        ctor.supr = defaults.common.ctor.supr;
      }
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
      interfaces.push(...defaults.common.interfaces);
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

    for (const context of contexts) {
      const storage = context.model.type.type;

      dependencies.push(context.model);

      if (Array.isArray(defaults?.[storage]?.ctor?.params)) {
        ctor.params.push(...defaults[storage].ctor.params);
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
      is_abstract:
        config.components.repositoryImpl.elementType === "abstract_class",
    };

    const element = ClassSchema.create<RepositoryElement>(classData, config, {
      addons,
      dependencies,
    });

    const component = Component.create<RepositoryElement>(config, {
      id,
      type: RepositoryImplType.create(componentName, name),
      endpoint,
      path: componentPath,
      writeMethod,
      addons: null,
      element,
      dependencies,
    });

    return component;
  }
}
