import { nanoid } from "nanoid";
import { ConfigTools, ReservedType } from "../../config";
import { TypeInfo } from "../../type.info";
import { SchemaTools } from "../schema.tools";
import { ExportData, ExportJson, ExportSchema } from "./export.schema";
import { GenericData, GenericJson, GenericSchema } from "./generic.schema";
import { MethodData, MethodJson, MethodSchema } from "./method.schema";
import { PropData, PropJson, PropSchema } from "./prop.schema";

export type InterfaceData = {
  exp?: ExportData;
  inheritance?: TypeInfo;
  props: PropData[];
  methods: MethodData[];
  generics?: GenericData[];
  name: string;
  id?: string;
};

export type InterfaceJson = {
  exp?: string | boolean | ExportJson;
  inheritance?: string | TypeInfo;
  props?: (PropJson | string)[];
  methods?: (MethodJson | string)[];
  generics?: (GenericJson | string)[];
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
    let inheritance: TypeInfo;

    if (data.exp) {
      exp = ExportSchema.create(data.exp);
    }

    if (typeof data.inheritance === "string") {
      const temp = data.inheritance;
      if (ConfigTools.hasInstructions(temp)) {
        inheritance = ConfigTools.executeInstructions(
          temp,
          references,
          reserved
        );
      } else {
        inheritance = TypeInfo.create(temp, reserved);
      }
    } else {
      inheritance = data.inheritance;
    }

    const intf = new InterfaceSchema(
      data.id || nanoid(),
      data.name,
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

    return intf;
  }

  private __props: PropSchema[] = [];
  private __methods: MethodSchema[] = [];
  private __generics: GenericSchema[] = [];

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly exp: ExportSchema,
    public readonly inheritance: TypeInfo
  ) {}

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

  toObject() {
    const { id, name, __methods, __props, __generics, exp, inheritance } = this;
    const intf: InterfaceData = {
      id,
      name,
      inheritance,
      exp: exp?.toObject(),
      methods: __methods.map((i) => i.toObject()),
      props: __props.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
    };

    return SchemaTools.removeNullUndefined(intf);
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
