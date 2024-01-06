import {
  ConfigAddons,
  ReservedType,
  ConfigInstruction,
  ConfigUseInstruction,
  ConfigDependencyInstruction,
} from "../../config";
import { TypeInfo, ObjectType, UnknownType } from "../../type.info";
import { Component } from "../component";
import { SchemaTools } from "../schema.tools";
import { ExportData, ExportJson, ExportSchema } from "./export.schema";
import {
  GenericData,
  GenericJson,
  GenericTools,
  GenericSchema,
} from "./generic.schema";
import { PropData, PropJson, PropSchema } from "./prop.schema";

export const TYPE_REGEX =
  /([a-zA-Z0-9_]+)\s*(<([a-zA-Z0-9_, \<\>\[\]\(\)]+)>)?(\s*=\s*(.+))?/;

export type TypeData = {
  id?: string;
  exp?: ExportData;
  name?: string;
  props?: (PropData | string)[];
  type?: TypeInfo;
  generics?: GenericData[];
};

export type TypeJson = {
  id?: string;
  exp?: string | boolean | ExportJson;
  name?: string;
  props?: PropJson[];
  type: string;
  generics?: GenericJson[];
};

export type TypeConfig = TypeJson & ConfigAddons;

export class TypeTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): TypeData {
    let type: TypeInfo;
    let name: string;
    let props: PropData[] = [];
    let generics: GenericData[] = [];

    const match = str.match(TYPE_REGEX);

    name = match[1].trim();

    SchemaTools.splitIgnoringBrackets(match[3], ",").forEach((str) => {
      generics.push(
        GenericTools.stringToData(str, reserved, dependencies, addons)
      );
    });

    if (match[5]) {
      try {
        const obj = JSON.parse(match[5]);
        Object.keys(obj).forEach((key) => {
          props.push({ name: key, type: obj[key] });
        });
        type = new ObjectType();
      } catch (e) {
        const temp = match[5].trim();
        if (ConfigInstruction.isUseInstruction(temp)) {
          type = TypeInfo.create(
            ConfigUseInstruction.getValue(temp, addons),
            reserved
          );
        } else if (ConfigInstruction.isDependencyInstruction(temp)) {
          const component = ConfigDependencyInstruction.getDependency(
            temp,
            dependencies
          );
          type = TypeInfo.fromComponent(component);
        } else {
          type = TypeInfo.create(temp, reserved);
        }
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
  public static create(
    data: string | TypeData | TypeJson,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ) {
    if (!data) {
      return null;
    }

    let exp: ExportSchema;
    let type: TypeInfo;
    let name: string;
    let props: PropSchema[] = [];
    let generics: GenericSchema[] = [];

    if (typeof data === "string") {
      const tp = TypeTools.stringToData(data, reserved, dependencies, addons);
      type = tp.type;
      name = tp.name;
      props = tp.props.map((p) =>
        PropSchema.create(p, reserved, dependencies, addons)
      );
      generics = tp.generics.map((g) =>
        GenericSchema.create(g, reserved, dependencies, addons)
      );
    } else {
      name = data.name;

      if (typeof data.type === "string") {
        let temp = data.type.trim();

        if (ConfigInstruction.isUseInstruction(temp)) {
          type = TypeInfo.create(
            ConfigUseInstruction.getValue(temp, addons),
            reserved
          );
        } else if (ConfigInstruction.isDependencyInstruction(temp)) {
          const component = ConfigDependencyInstruction.getDependency(
            temp,
            dependencies
          );
          type = TypeInfo.fromComponent(component);
        } else {
          type = TypeInfo.create(temp, reserved);
        }
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
          props.push(PropSchema.create(p, reserved, dependencies, addons));
        });
      }
    }

    const t = new TypeSchema(name, exp);

    generics.forEach((g) => t.addGeneric(g));
    props.forEach((p) => t.addProp(p));

    return t;
  }

  private __props: PropSchema[] = [];
  private __generics: GenericSchema[] = [];

  private constructor(
    public readonly name: string,
    // public readonly type: TypeInfo,
    public readonly exp: ExportSchema
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

  toObject() {
    const { __props, __generics, name, exp } = this;

    return {
      name,
      exp,
      props: __props.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
    };
  }

  listTypes() {
    const { __props, __generics } = this;
    const types = [];

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
