import { nanoid } from "nanoid";
import { WriteMethod } from "../enums";
import { TypeInfo } from "../type.info";
import { SchemaTools } from "./schema.tools";
import {
  PropSchema,
  GenericSchema,
  MethodSchema,
  InterfaceSchema,
  MethodObject,
  PropObject,
  GenericObject,
  InterfaceObject,
  ImportObject,
  ConstructorObject,
  InheritanceObject,
  ExportObject,
  FunctionObject,
  ImportSchema,
  ImportTools,
  ImportData,
} from "./schemas";
import { ComponentTools } from "./component.tools";
import { Config } from "../config";

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

export interface ElementWithImports {
  interfaces: ImportSchema[];
  addImport(intf: ImportSchema);
  findImport(data: ImportData): ImportSchema;
  hasImport(name: string): boolean;
}

export type ElementObject = {
  name: string;
  template?: string;
  exp?: ExportObject;
  inheritance?: InheritanceObject[];
  ctor?: ConstructorObject;
  methods?: MethodObject[];
  props?: PropObject[];
  generics?: GenericObject[];
  interfaces?: InterfaceObject[];
  imports?: ImportObject[];
  functions?: FunctionObject[];
  alias?: any;
};

export type ComponentElement = ElementObject &
  ElementWithImports & {
    toObject(): ElementObject;
    listTypes(): TypeInfo[];
  };

export type Dependency = {
  id: string;
  name: string;
  type: TypeInfo;
  path: string;
};

export type ComponentData<Element = ElementObject, ElementAddons = unknown> = {
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
  ElementAddons = unknown,
> {
  public static create<
    Element extends ComponentElement,
    ElementAddons = unknown,
  >(
    config: Config,
    data: {
      id: string;
      type: TypeInfo;
      endpoint: string;
      path: string;
      writeMethod: WriteMethod;
      addons: ElementAddons;
      element: Element;
      dependencies: Component[];
    }
  ): Component<Element, ElementAddons> {
    const {
      id,
      type,
      endpoint,
      path,
      writeMethod,
      addons,
      element,
      dependencies,
    } = data;
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
      dependencies.forEach((d) => {
        component.addDependency(d, config);
      });
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

  addDependency(dependency: Component, config: Config) {
    const { id, path, type, element } = dependency;

    if (dependency && this.hasDependency(dependency) === false) {
      this.__dependencies.push({ id, path, type, name: element.name });

      if (Array.isArray(this.element.imports) && this.path !== path) {
        const relativePath = ImportTools.createRelativeImportPath(
          this.path,
          path
        );
        const impt = this.element.findImport({ path: relativePath });

        if (impt) {
          if (element.exp?.is_default && !impt.dflt) {
            impt.dflt["dflt"] = element.name;
          } else {
            impt.list.push(element.name);
          }
        } else {
          let impt = { path, ref_path: this.path };
          if (element.exp?.is_default) {
            impt["dflt"] = element.name;
          } else {
            impt["list"] = [element.name];
          }

          this.element.addImport(ImportSchema.create(impt, config));
        }
      }
    }
  }

  hasDependency(dependency: Component) {
    return (
      this.__dependencies.findIndex((d) => {
        return (
          d.name === dependency.element.name &&
          d.type.ref === dependency.type.ref &&
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

  toObject(): ComponentData<ElementObject, ElementAddons> {
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
