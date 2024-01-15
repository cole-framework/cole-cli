import {
  ExportData,
  ExportJson,
  ExportObject,
  ExportSchema,
} from "./export.schema";
import {
  GenericData,
  GenericJson,
  GenericObject,
  GenericSchema,
} from "./generic.schema";
import {
  MethodData,
  MethodJson,
  MethodObject,
  MethodSchema,
} from "./method.schema";
import { PropData, PropJson, PropObject, PropSchema } from "./prop.schema";
import {
  ConstructorData,
  ConstructorJson,
  ConstructorObject,
  ConstructorSchema,
} from "./constructor.schema";
import {
  InterfaceData,
  InterfaceJson,
  InterfaceObject,
  InterfaceSchema,
} from "./interface.schema";
import {
  InheritanceData,
  InheritanceJson,
  InheritanceObject,
  InheritanceSchema,
} from "./inheritance.schema";
import {
  ImportData,
  ImportJson,
  ImportObject,
  ImportSchema,
} from "./import.schema";
import { ReservedType } from "../../config";
import { SchemaTools } from "../schema.tools";
import { TypeInfo } from "../../type.info";

export type ClassObject = {
  is_abstract?: boolean;
  exp?: ExportObject;
  ctor?: ConstructorObject;
  interfaces?: InterfaceObject[];
  inheritance?: InheritanceObject[];
  props?: PropObject[];
  methods?: MethodObject[];
  generics?: GenericObject[];
  imports?: ImportObject[];
  name: string;
};

export type ClassData = {
  is_abstract?: boolean;
  exp?: ExportData;
  ctor?: ConstructorData;
  interfaces?: InterfaceData[];
  inheritance?: InheritanceData[];
  props?: PropData[];
  methods?: MethodData[];
  generics?: GenericData[];
  imports?: ImportData[];
  name: string;
  id?: string;
};

export type ClassJson = {
  is_abstract?: boolean;
  exp?: string | boolean | ExportJson;
  ctor?: string | ConstructorJson;
  interfaces?: (string | InterfaceJson)[];
  inheritance?: (string | InheritanceJson)[];
  props?: (PropJson | string)[];
  methods?: (MethodJson | string)[];
  generics?: (GenericJson | string)[];
  imports?: (ImportJson | string)[];
  name?: string;
  id?: string;
};

export class ClassSchema {
  public static create<T>(
    data: ClassData | ClassJson,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ): T {
    if (!data) {
      return null;
    }

    let exp: ExportSchema;
    let ctor: ConstructorSchema;
    let inheritance: InheritanceSchema[] = [];

    if (data.exp) {
      exp = ExportSchema.create(data.exp);
    }

    if (data.ctor) {
      if (SchemaTools.executeMeta(data.ctor, references, reserved)) {
        ctor = ConstructorSchema.create(data.ctor, reserved, references);
      }
    }

    if (Array.isArray(data.inheritance)) {
      data.inheritance.forEach((i) => {
        if (typeof i === "string") {
          inheritance.push(
            InheritanceSchema.create({ name: i }, reserved, references)
          );
        } else {
          if (SchemaTools.executeMeta(i, references, reserved)) {
            inheritance.push(InheritanceSchema.create(i, reserved, references));
          }
        }
      });
    }

    const cls = new ClassSchema(
      data.is_abstract || false,
      data.name,
      exp,
      ctor,
      inheritance
    );

    if (Array.isArray(data.interfaces)) {
      data.interfaces.forEach((i) => {
        if (SchemaTools.executeMeta(i, references, reserved)) {
          cls.addInterface(InterfaceSchema.create(i, reserved, references));
        }
      });
    }

    if (Array.isArray(data.props)) {
      data.props.forEach((p) => {
        if (SchemaTools.executeMeta(p, references, reserved)) {
          cls.addProp(PropSchema.create(p, reserved, references));
        }
      });
    }

    if (Array.isArray(data.methods)) {
      data.methods.forEach((m) => {
        if (SchemaTools.executeMeta(m, references, reserved)) {
          cls.addMethod(MethodSchema.create(m, reserved, references));
        }
      });
    }

    if (Array.isArray(data.generics)) {
      data.generics.forEach((g) => {
        if (SchemaTools.executeMeta(g, references, reserved)) {
          cls.addGeneric(GenericSchema.create(g, reserved, references));
        }
      });
    }

    if (Array.isArray(data.imports)) {
      data.imports.forEach((i) => {
        if (SchemaTools.executeMeta(i, references, reserved)) {
          cls.addImport(ImportSchema.create(i, reserved, references));
        }
      });
    }

    return cls as T;
  }

  private __imports: ImportSchema[] = [];
  private __props: PropSchema[] = [];
  private __methods: MethodSchema[] = [];
  private __generics: GenericSchema[] = [];
  private __interfaces: InterfaceSchema[] = [];
  private __inheritance: InheritanceSchema[] = [];

  private constructor(
    public readonly isAbstract: boolean,
    public readonly name: string,
    public readonly exp: ExportSchema,
    public readonly ctor: ConstructorSchema,
    inheritance: InheritanceSchema[] = []
  ) {
    inheritance.forEach((i) => {
      this.__inheritance.push(i);
    });
  }

  get inheritance() {
    return [...this.__inheritance];
  }

  addImport(impt: ImportSchema) {
    if (this.hasImport(impt) === false) {
      this.__imports.push(impt);
    }
  }

  findImport(impt: ImportData) {
    const { dflt, path, alias, list } = impt;

    return this.__imports.find(
      (p) =>
        p.path === path &&
        p.alias === alias &&
        p.dflt === dflt &&
        impt.list.every((i) => list.includes(i))
    );
  }

  hasImport(impt: ImportData) {
    const { dflt, path, alias, list } = impt;

    return (
      this.__imports.findIndex(
        (p) =>
          p.path === path &&
          p.alias === alias &&
          p.dflt === dflt &&
          impt.list.every((i) => list.includes(i))
      ) > -1
    );
  }

  get imports() {
    return [...this.__imports];
  }

  addProp(prop: PropSchema) {
    if (this.hasProp(prop.name) === false) {
      this.__props.push(prop);
    }
  }

  findProp(name: string) {
    return this.__props.find((p) => p.name === name);
  }

  hasProp(name: string) {
    return this.__props.findIndex((p) => p.name === name) !== -1;
  }

  get props() {
    return [...this.__props];
  }

  addGeneric(generic: GenericSchema) {
    if (this.hasGeneric(generic.name) === false) {
      this.__generics.push(generic);
    }
  }

  findGeneric(name: string) {
    return this.__generics.find((p) => p.name === name);
  }

  hasGeneric(name: string) {
    return this.__generics.findIndex((p) => p.name === name) !== -1;
  }

  get generics() {
    return [...this.__generics];
  }

  addMethod(method: MethodSchema) {
    if (this.hasMethod(method.name) === false) {
      this.__methods.push(method);
    }
  }

  findMethod(name: string) {
    return this.__methods.find((p) => p.name === name);
  }

  hasMethod(name: string) {
    return this.__methods.findIndex((p) => p.name === name) !== -1;
  }

  get methods() {
    return [...this.__methods];
  }

  addInterface(intf: InterfaceSchema) {
    if (this.hasInterface(intf.name) === false) {
      this.__interfaces.push(intf);
    }
  }

  findInterface(name: string) {
    return this.__interfaces.find((p) => p.name === name);
  }

  hasInterface(name: string) {
    return this.__interfaces.findIndex((p) => p.name === name) !== -1;
  }

  get interfaces() {
    return [...this.__interfaces];
  }

  toObject(): ClassObject {
    const {
      name,
      ctor,
      exp,
      isAbstract,
      __inheritance,
      __methods,
      __props,
      __generics,
      __interfaces,
      __imports,
    } = this;

    const cls: ClassObject = {
      is_abstract: isAbstract,
      name,
      inheritance: __inheritance?.map((i) => i.toObject()),
      ctor: ctor?.toObject(),
      exp: exp?.toObject(),
      methods: __methods.map((i) => i.toObject()),
      props: __props.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      interfaces: __interfaces.map((i) => i.toObject()),
      imports: __imports.map((i) => i.toObject()),
    };

    return cls;
  }

  listTypes() {
    const { inheritance, __methods, __generics, __props, __interfaces } = this;
    const types: TypeInfo[] = [];

    __generics.forEach((g) => {
      types.push(...g.listTypes());
    });

    __props.forEach((p) => {
      types.push(...p.listTypes());
    });

    __methods.forEach((m) => {
      types.push(...m.listTypes());
    });

    __interfaces.forEach((i) => {
      types.push(...i.listTypes());
    });

    inheritance.forEach((i) => {
      types.push(...i.listTypes());
    });

    return types.reduce((list: TypeInfo[], current: TypeInfo) => {
      const keys = Object.keys(current);
      if (
        list.findIndex((i) => {
          for (const key of keys) {
            if (i[key] !== current[key]) {
              return false;
            }
          }
          return true;
        }) === -1
      ) {
        list.push(current);
      }
      return list;
    }, []);
  }
}
