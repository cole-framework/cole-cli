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
import { ComponentTools } from "./component.tools";

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
    type: TypeInfo,
    endpoint: string,
    path: string,
    writeMethod: WriteMethod,
    addons: ElementAddons,
    element: Element,
    dependencies: Component[]
  ): Component<Element, ElementAddons> {
    const component = new Component(
      id || nanoid(),
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

  private __dependencies: Dependency[] = [];

  protected constructor(
    public readonly id: string,
    public readonly type: TypeInfo,
    public readonly endpoint: string,
    public readonly path: string,
    public readonly writeMethod: WriteMethod,
    public readonly addons: ElementAddons,
    public readonly element: Element
  ) {}

  addDependency(dependency: Component) {
    const { id, path, type, element } = dependency;

    if (dependency && this.hasDependency(dependency) === false) {
      this.__dependencies.push({ id, path, type, name: element.name });
    }
  }

  hasDependency(dependency: Component) {
    return (
      this.__dependencies.findIndex((d) => {
        return (
          d.name === dependency.element.name &&
          d.type.name === dependency.type.name &&
          d.type.type === dependency.type.type &&
          d.path === dependency.path
        );
      }) !== -1
    );
  }

  get unresolvedDependencies() {
    const { element, dependencies } = this;
    const types: TypeInfo[] = [];

    element.listTypes().forEach((type) => {
      ComponentTools.filterComponentTypes(type).forEach((componentType) => {
        if (
          dependencies.findIndex((d) =>
            TypeInfo.areIdentical(d.type, componentType)
          ) === -1
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
