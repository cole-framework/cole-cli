import {
  ConfigAddons,
  ReservedType,
  ConfigInstruction,
  ConfigUseInstruction,
  ConfigDependencyInstruction,
} from "../../config";
import { AccessType } from "../../enums";
import { TypeInfo, UnknownType } from "../../type.info";
import { Component } from "../component";
import { SchemaTools } from "../schema.tools";
import {
  GenericData,
  GenericJson,
  GenericTools,
  GenericSchema,
} from "./generic.schema";
import { ParamData, ParamJson, ParamTools, ParamSchema } from "./param.schema";

export const METHOD_REGEX =
  /^(static|async|private|protected|public)?\s*(static|async|private|protected|public)?\s*(async|static|private|protected|public)?\s*([a-zA-Z0-9_]+)(\s*\<(.+)\>\s*)?(\((.*)\))?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\\}]+))?(\s*=>\s*(.*))?$/;

export type MethodData = {
  access?: string;
  name?: string;
  return_type?: TypeInfo;
  is_async?: boolean;
  is_static?: boolean;
  params?: ParamData[];
  body?: string;
  supr?: MethodData;
  generics?: GenericData[];
};

export type MethodJson = {
  access?: string;
  name?: string;
  return_type?: string;
  is_async?: boolean;
  is_static?: boolean;
  params?: (ParamJson | string)[];
  body?: string;
  supr?: MethodJson;
  generics?: (GenericJson | string)[];
};

export type MethodConfig = MethodJson & ConfigAddons;

export class MethodTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): MethodData {
    let name: string;
    let access: string;
    let params: ParamData[] = [];
    let returnType: TypeInfo;
    let isAsync: boolean;
    let isStatic: boolean;
    let body: string;
    let supr: MethodData;
    let generics: GenericData[] = [];

    const match = str.match(METHOD_REGEX);

    if (Array.isArray(match)) {
      access =
        SchemaTools.getAccessType(
          match[1]?.trim(),
          match[2]?.trim(),
          match[3]?.trim()
        ) || AccessType.Public;
      isStatic = SchemaTools.isStatic(
        match[1]?.trim(),
        match[2]?.trim(),
        match[3]?.trim()
      );
      isAsync = SchemaTools.isAsync(
        match[1]?.trim(),
        match[2]?.trim(),
        match[3]?.trim()
      );

      if (match[4]) {
        let temp = match[4].trim();
        name = temp;
        if (ConfigInstruction.isUseInstruction(temp)) {
          name = ConfigUseInstruction.getValue(temp, addons);
        }
      }

      if (match[10]) {
        let temp = match[10].trim();
        if (ConfigInstruction.isUseInstruction(temp)) {
          returnType = TypeInfo.create(
            ConfigUseInstruction.getValue(temp, addons),
            reserved
          );
        } else if (ConfigInstruction.isDependencyInstruction(temp)) {
          const component = ConfigDependencyInstruction.getDependency(
            temp,
            dependencies
          );
          returnType = TypeInfo.fromComponent(component);
        } else {
          returnType = TypeInfo.create(temp, reserved);
        }
      } else {
        returnType = new UnknownType();
      }

      body = match[12]?.trim();

      SchemaTools.splitIgnoringBrackets(match[6], ",").forEach((str) => {
        generics.push(
          GenericTools.stringToData(str, reserved, dependencies, addons)
        );
      });
      SchemaTools.splitIgnoringBrackets(match[8], ",").forEach((str) => {
        params.push(
          ParamTools.stringToData(str, reserved, dependencies, addons)
        );
      });
    } else {
      throw new Error(`Method regex match failure`);
    }

    return {
      name,
      access,
      params,
      return_type: returnType,
      is_async: isAsync,
      is_static: isStatic,
      body,
      supr,
      generics,
    };
  }

  static arrayToData(
    data: (string | MethodJson)[],
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ) {
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") {
          return MethodTools.stringToData(item, reserved, dependencies, addons);
        }
        let name = item.name;
        let return_type;

        if (typeof item.return_type === "string") {
          if (ConfigInstruction.isUseInstruction(item.return_type)) {
            return_type = TypeInfo.create(
              ConfigUseInstruction.getValue(item.return_type, addons),
              reserved
            );
          } else if (
            ConfigInstruction.isDependencyInstruction(item.return_type)
          ) {
            const component = ConfigDependencyInstruction.getDependency(
              item.return_type,
              dependencies
            );
            return_type = TypeInfo.fromComponent(component);
          } else {
            return_type = TypeInfo.create(item.return_type, reserved);
          }
        }

        if (typeof item.name === "string") {
          if (ConfigInstruction.isUseInstruction(item.name)) {
            name = ConfigUseInstruction.getValue(item.name, addons);
          }
        }

        return {
          name,
          params: Array.isArray(item.params)
            ? ParamTools.arrayToData(item.params, reserved, [], addons)
            : [],
          access: item.access,
          is_async: item.is_async,
          is_static: item.is_static,
          return_type,
        };
      });
    }
    return [];
  }
}

export class MethodSchema {
  public static create(
    data: MethodData | MethodJson | string,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): MethodSchema {
    if (!data) {
      return null;
    }

    let name: string;
    let access: string;
    let params: ParamSchema[] = [];
    let returnType: TypeInfo;
    let isAsync: boolean;
    let isStatic: boolean;
    let body: string;
    let supr: MethodSchema;
    let generics: GenericSchema[] = [];

    if (typeof data === "string") {
      const mth = MethodTools.stringToData(
        data,
        reserved,
        dependencies,
        addons
      );
      name = mth.name;
      access = mth.access;
      params = mth.params.map((p) =>
        ParamSchema.create(p, reserved, dependencies, addons)
      );
      returnType = mth.return_type;
      isAsync = mth.is_async;
      isStatic = mth.is_static;
      body = mth.body;
      generics = mth.generics.map((g) =>
        GenericSchema.create(g, reserved, dependencies, addons)
      );
    } else {
      access = data.access || AccessType.Public;
      name = data.name;
      isAsync = data.is_async;
      isStatic = data.is_static;
      body = data.body;

      if (ConfigInstruction.isUseInstruction(data.name)) {
        name = ConfigUseInstruction.getValue(data.name, addons);
      }

      if (TypeInfo.isType(data.return_type)) {
        returnType = data.return_type;
      } else if (typeof data.return_type === "string") {
        if (ConfigInstruction.isUseInstruction(data.return_type)) {
          returnType = TypeInfo.create(
            ConfigUseInstruction.getValue(data.return_type, addons),
            reserved
          );
        } else if (
          ConfigInstruction.isDependencyInstruction(data.return_type)
        ) {
          const component = ConfigDependencyInstruction.getDependency(
            data.return_type,
            dependencies
          );
          returnType = TypeInfo.fromComponent(component);
        } else {
          returnType = TypeInfo.create(data.return_type, reserved);
        }
      }

      if (Array.isArray(data.params)) {
        data.params.forEach((param) => {
          params.push(
            ParamSchema.create(param, reserved, dependencies, addons)
          );
        });
      } else if (
        typeof data.params === "string" &&
        ConfigInstruction.isUseInstruction(data.params)
      ) {
        const ref = ConfigUseInstruction.getValue(data.params, addons);
        if (Array.isArray(ref)) {
          ref.forEach((param) => {
            params.push(ParamSchema.create(param, reserved, dependencies));
          });
        }
      }

      if (Array.isArray(data.generics)) {
        data.generics.forEach((g) => {
          generics.push(
            GenericSchema.create(g, reserved, dependencies, addons)
          );
        });
      }

      if (data.supr) {
        supr = MethodSchema.create(data.supr, reserved, dependencies, addons);
      }
    }

    const method = new MethodSchema(
      name,
      access,
      returnType,
      isStatic,
      isAsync,
      body,
      supr
    );

    params.forEach((param) => {
      method.addParam(param);
    });

    generics.forEach((generic) => {
      method.addGeneric(generic);
    });

    return method;
  }

  private __params: ParamSchema[] = [];
  private __generics: GenericSchema[] = [];

  private constructor(
    public readonly name: string,
    public readonly access: string,
    public readonly returnType: TypeInfo,
    public readonly isStatic: boolean,
    public readonly isAsync: boolean,
    public readonly body: string,
    public readonly supr: MethodSchema
  ) {}

  addParam(param: ParamSchema) {
    if (this.hasParam(param.name) === false) {
      this.__params.push(param);
    }
  }

  findParam(name: string) {
    return this.__params.find((p) => p.name === name);
  }

  hasParam(name: string) {
    return this.__params.findIndex((p) => p.name === name) !== -1;
  }

  get params() {
    return [...this.__params];
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
    const { access, __params, __generics, body, supr } = this;
    const mth: MethodData = {
      access,
      params: __params.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      body,
    };

    if (supr) {
      mth.supr = supr.toObject();
    }

    return SchemaTools.removeNullUndefined(mth);
  }

  listTypes() {
    const { returnType, __generics, __params, supr } = this;
    const list = [];

    if (returnType) {
      list.push(returnType);
    }

    __generics.forEach((g) => {
      list.push(...g.listTypes());
    });

    __params.forEach((p) => {
      list.push(...p.listTypes());
    });

    if (supr) {
      list.push(...supr.listTypes());
    }

    return list;
  }
}
