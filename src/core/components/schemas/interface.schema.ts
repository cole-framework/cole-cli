import { nanoid } from "nanoid";
import { ConfigTools, ReservedType } from "../../config";
import { TypeInfo } from "../../type.info";
import { SchemaTools } from "../schema.tools";
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
  ImportData,
  ImportJson,
  ImportObject,
  ImportSchema,
} from "./import.schema";
import {
  InheritanceData,
  InheritanceJson,
  InheritanceObject,
  InheritanceSchema,
} from "./inheritance.schema";

export type InterfaceObject = {
  exp: ExportObject;
  inheritance: InheritanceObject[];
  props: PropObject[];
  methods: MethodObject[];
  generics: GenericObject[];
  imports: ImportObject[];
  name: string;
  id: string;
};

export type InterfaceData = {
  exp?: ExportData;
  inheritance?: InheritanceData[];
  props: PropData[];
  methods: MethodData[];
  generics?: GenericData[];
  imports?: ImportData[];
  name: string;
  id?: string;
};

export type InterfaceJson = {
  exp?: string | boolean | ExportJson;
  inheritance?: (string | InheritanceJson)[];
  props?: (PropJson | string)[];
  methods?: (MethodJson | string)[];
  generics?: (GenericJson | string)[];
  imports?: (ImportJson | string)[];
  name?: string;
  id?: string;
};

export type InterfaceConfig = InterfaceJson;

export class InterfaceSchema {
  public static create(
    data: InterfaceData | InterfaceJson,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    if (!data) {
      return null;
    }

    let exp: ExportSchema;
    let inheritance: InheritanceSchema[] = [];

    if (data.exp) {
      exp = ExportSchema.create(data.exp);
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

    let name;
    if (ConfigTools.hasInstructions(data.name)) {
      name = ConfigTools.executeInstructions(data.name, references, reserved);
    } else {
      name = data.name;
    }

    const intf = new InterfaceSchema(
      data.id || nanoid(),
      name,
      exp,
      inheritance
    );

    if (Array.isArray(data.props)) {
      data.props.forEach((p) => {
        if (SchemaTools.executeMeta(p, references, reserved)) {
          intf.addProp(PropSchema.create(p, reserved, references));
        }
      });
    }

    if (Array.isArray(data.methods)) {
      data.methods.forEach((m) => {
        if (SchemaTools.executeMeta(m, references, reserved)) {
          intf.addMethod(MethodSchema.create(m, reserved, references));
        }
      });
    }

    if (Array.isArray(data.generics)) {
      data.generics.forEach((g) => {
        if (SchemaTools.executeMeta(g, references, reserved)) {
          intf.addGeneric(GenericSchema.create(g, reserved, references));
        }
      });
    }

    if (Array.isArray(data.imports)) {
      data.imports.forEach((i) => {
        if (SchemaTools.executeMeta(i, references, reserved)) {
          intf.addImport(ImportSchema.create(i, reserved, references));
        }
      });
    }

    return intf;
  }

  private __imports: ImportSchema[] = [];
  private __props: PropSchema[] = [];
  private __methods: MethodSchema[] = [];
  private __generics: GenericSchema[] = [];
  private __inheritance: InheritanceSchema[] = [];

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly exp: ExportSchema,
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

  toObject(): InterfaceObject {
    const {
      id,
      name,
      __methods,
      __props,
      __generics,
      __imports,
      __inheritance,
      exp,
    } = this;
    const intf: InterfaceObject = {
      id,
      name,
      inheritance: __inheritance?.map((i) => i.toObject()),
      exp: exp?.toObject(),
      methods: __methods.map((i) => i.toObject()),
      props: __props.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      imports: __imports.map((i) => i.toObject()),
    };

    return intf;
  }

  listTypes() {
    const { inheritance, __methods, __generics, __props } = this;
    const list = [];

    __generics.forEach((g) => {
      list.push(...g.listTypes());
    });

    __props.forEach((p) => {
      list.push(...p.listTypes());
    });

    __methods.forEach((m) => {
      list.push(...m.listTypes());
    });

    if (inheritance) {
      list.push(inheritance);
    }

    return list;
  }
}
