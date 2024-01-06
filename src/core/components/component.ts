import { nanoid } from "nanoid";
import { WriteMethod } from "../enums";
import { TypeInfo } from "../type.info";
import { SchemaTools } from "./schema.tools";
import {
  PropSchema,
  GenericSchema,
  MethodSchema,
  InterfaceSchema,
} from "./schemas";

export interface ElementWithProps {
  props: PropSchema[];
  addProp(prop: PropSchema);
  findProp(name: string): PropSchema;
  hasProp(name: string): boolean;
}

export interface ElementWithGenerics {
  generics: GenericSchema[];
  addGeneric(generic: GenericSchema);
  findGeneric(name: string): GenericSchema;
  hasGeneric(name: string): boolean;
}

export interface ElementWithMethods {
  methods: MethodSchema[];
  addMethod(method: MethodSchema);
  findMethod(name: string): MethodSchema;
  hasMethod(name: string): boolean;
}

export interface ElementWithInterfaces {
  interfaces: InterfaceSchema[];
  addInterface(intf: InterfaceSchema);
  findInterface(name: string): InterfaceSchema;
  hasInterface(name: string): boolean;
}

export interface ComponentElement<ElementObject = any> {
  name: string;
  toObject(): ElementObject;
  listTypes(): TypeInfo[];
}

export type Dependency = {
  id: string;
  name: string;
  type: TypeInfo;
  path: string;
};

export type ComponentData<Element, ElementAddons> = {
  id: string;
  name: string;
  type: TypeInfo;
  path: string;
  write_method: string;
  addons: ElementAddons;
  element: Element;
  dependencies: Dependency[];
};

export class Component<
  Element extends ComponentElement = ComponentElement,
  ElementAddons = unknown
> {
  public static create<
    Element extends ComponentElement,
    ElementAddons = unknown
  >(
    id: string,
    name: string,
    type: TypeInfo,
    endpoint: string,
    path: string,
    writeMethod: WriteMethod,
    addons: ElementAddons,
    element: Element,
    dependencies?: (Dependency | Component)[]
  ): Component<Element, ElementAddons> {
    const component = new Component(
      id || nanoid(),
      name,
      type,
      endpoint,
      path,
      writeMethod,
      addons,
      element
    );

    if (Array.isArray(dependencies)) {
      dependencies.forEach((d) => component.addDependency(d));
    }

    return component;
  }

  private __dependencies = [];

  protected constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: TypeInfo,
    public readonly endpoint: string,
    public readonly path: string,
    public readonly writeMethod: WriteMethod,
    public readonly addons: ElementAddons,
    public readonly element: Element
  ) {}

  addDependency(dependency: Dependency | Component) {
    if (dependency && this.hasDependency(dependency) === false) {
      const { id, name, path, type } = dependency;
      this.__dependencies.push({ id, name, path, type });
    }
  }

  hasDependency(dependency: Dependency) {
    return (
      this.__dependencies.findIndex(
        (d) =>
          d.name === dependency.name &&
          d.type === dependency.type &&
          d.path === dependency.path
      ) !== -1
    );
  }

  get unresolvedDependencies() {
    const { element, dependencies } = this;
    const types: TypeInfo[] = [];

    element.listTypes().forEach((type) => {
      ComponentTools.filterComponentTypes(type).forEach((componentType) => {
        if (
          dependencies.findIndex((d) => d.name === componentType.name) === -1
        ) {
          types.push(componentType);
        }
      });
    });

    return types;
  }

  get dependencies() {
    return [...this.__dependencies];
  }

  toObject(): ComponentData<Element, ElementAddons> {
    const {
      name,
      type,
      id,
      element,
      endpoint,
      path,
      addons,
      writeMethod: write_method,
      dependencies,
    } = this;

    return SchemaTools.removeNullUndefined({
      id,
      name,
      endpoint,
      type,
      path,
      write_method,
      dependencies,
      element: element?.toObject(),
      addons,
    });
  }
}

export class ComponentTools {
  static filterComponentTypes(type: TypeInfo): TypeInfo[] {
    if (TypeInfo.isComponentType(type)) {
      return [type];
    }

    if (TypeInfo.isArray(type) || TypeInfo.isSet(type)) {
      return ComponentTools.filterComponentTypes(type.itemType);
    }

    if (TypeInfo.isMap(type)) {
      return [
        ...ComponentTools.filterComponentTypes(type.keyType),
        ...ComponentTools.filterComponentTypes(type.valueType),
      ];
    }

    if (TypeInfo.isMultiType(type)) {
      return type.chain.reduce((list, c) => {
        if (TypeInfo.isType(c)) {
          list.push(...ComponentTools.filterComponentTypes(c));
        }
        return list;
      }, []);
    }

    return [];
  }
}
