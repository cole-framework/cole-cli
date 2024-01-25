import { ConfigAddons, ConfigTools, ReservedType } from "../../config";
import { TypeInfo, ObjectType, UnknownType } from "../../type.info";
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
  GenericTools,
  GenericSchema,
  GenericObject,
} from "./generic.schema";
import {
  ImportData,
  ImportJson,
  ImportObject,
  ImportSchema,
} from "./import.schema";
import { PropData, PropJson, PropObject, PropSchema } from "./prop.schema";

export const TYPE_REGEX =
  /([a-zA-Z0-9_]+)\s*(<([a-zA-Z0-9_, \<\>\[\]\(\)]+)>)?(\s*=\s*(.+))?/;

export type TypeData = {
  id?: string;
  exp?: ExportData;
  name?: string;
  props?: (PropData | string)[];
  type?: TypeInfo;
  generics?: GenericData[];
  imports?: ImportData[];
  alias?: any;
};

export type TypeObject = {
  exp?: ExportObject;
  name: string;
  props?: PropObject[];
  generics?: GenericObject[];
  alias?: any;
  imports?: ImportObject[];
};

export type TypeJson = {
  id?: string;
  exp?: string | boolean | ExportJson;
  name?: string;
  props?: PropJson[];
  type: string;
  generics?: GenericJson[];
  imports?: ImportJson[];
  alias?: any;
};

export type TypeConfig = TypeJson & ConfigAddons;

export class TypeTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ): TypeData {
    let type: TypeInfo;
    let name: string;
    let props: PropData[] = [];
    let generics: GenericData[] = [];

    const match = str.match(TYPE_REGEX);

    name = match[1].trim();

    SchemaTools.splitIgnoringBrackets(match[3], ",").forEach((str) => {
      generics.push(GenericTools.stringToData(str, reserved, references));
    });

    if (match[5]) {
      try {
        const obj = JSON.parse(match[5]);
        Object.keys(obj).forEach((key) => {
          props.push({ name: key, type: obj[key] });
        });
        type = new ObjectType();
      } catch (e) {
        let temp = match[5].trim();
        if (ConfigTools.hasInstructions(temp)) {
          temp = ConfigTools.executeInstructions(temp, references, reserved);
        }
        type = TypeInfo.create(temp, reserved);
      }
    }

    return {
      type,
      name,
      props,
      generics,
    };
  }
}

export class TypeSchema {
  public static create<T>(
    data: string | TypeData | TypeJson,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    if (!data) {
      return null;
    }

    let exp: ExportSchema;
    let type: TypeInfo;
    let alias: TypeInfo;
    let name: string;
    let props: PropSchema[] = [];
    let generics: GenericSchema[] = [];
    let imports = [];

    if (typeof data === "string") {
      const tp = TypeTools.stringToData(data, reserved, references);
      type = tp.type;
      name = tp.name;
      props = tp.props.map((p) => PropSchema.create(p, reserved, references));
      generics = tp.generics.map((g) =>
        GenericSchema.create(g, reserved, references)
      );
    } else {
      name = data.name;

      if (typeof data.type === "string") {
        let temp = data.type.trim();

        if (ConfigTools.hasInstructions(temp)) {
          temp = ConfigTools.executeInstructions(temp, references, reserved);
        }
        type = TypeInfo.create(temp, reserved);
      } else if (TypeInfo.isType(data.type)) {
        type = data.type;
      } else {
        type = new UnknownType();
      }

      if (data.exp) {
        exp = ExportSchema.create(data.exp);
      }

      if (Array.isArray(data.props)) {
        data.props.forEach((p) => {
          props.push(PropSchema.create(p, reserved, references));
        });
      }

      if (typeof data.alias === "string") {
        let temp = data.alias.trim();

        if (ConfigTools.hasInstructions(temp)) {
          alias = ConfigTools.executeInstructions(temp, references, reserved);
        } else {
          alias = TypeInfo.create(temp, reserved);
        }
      } else if (TypeInfo.isType(data.alias)) {
        alias = data.alias;
      }

      if (Array.isArray(data.imports)) {
        imports = [...data.imports];
      }
    }

    const t = new TypeSchema(name, alias, exp);

    generics.forEach((g) => t.addGeneric(g));
    props.forEach((p) => t.addProp(p));

    imports.forEach((i) => {
      if (SchemaTools.executeMeta(i, references, reserved)) {
        t.addImport(ImportSchema.create(i, reserved, references));
      }
    });

    return t as T;
  }

  private __imports: ImportSchema[] = [];
  private __props: PropSchema[] = [];
  private __generics: GenericSchema[] = [];

  private constructor(
    public readonly name: string,
    public readonly alias: TypeInfo,
    public readonly exp: ExportSchema
  ) {}

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

  toObject(): TypeObject {
    const { __props, __generics, name, exp, alias, __imports } = this;

    return {
      name,
      exp: exp?.toObject(),
      alias,
      props: __props.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      imports: __imports.map((i) => i.toObject()),
    };
  }

  listTypes() {
    const { __props, __generics, alias } = this;
    const types = [];

    if (alias) {
      types.push(alias);
    }

    __props.forEach((prop) => {
      types.push(prop.type);
    });

    __generics.forEach((generic) => {
      if (generic.dflt) {
        types.push(generic.dflt);
      }

      if (generic.inheritance) {
        types.push(generic.inheritance);
      }
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
