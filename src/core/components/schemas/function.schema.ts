import { TypeInfo, UnknownType } from "../../type.info";
import { ParamData, ParamJson, ParamSchema, ParamTools } from "./param.schema";

import {
  GenericData,
  GenericJson,
  GenericSchema,
  GenericTools,
} from "./generic.schema";
import {
  ReservedType,
  ConfigInstruction,
  ConfigUseInstruction,
  ConfigDependencyInstruction,
} from "../../config";
import { Component } from "../component";
import { SchemaTools } from "../schema.tools";

export const foo = <T extends string | number>(foo: T) => {
  foo;
};

export const FUNCTION_REGEX =
  /^(async)?\s*([a-zA-Z0-9_]+)(\s*\<(.+)\>\s*)?(\((.*)\))?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\\}]+))?(\s*=>\s*(.*))?$/;

export type FunctionData = {
  name?: string;
  return_type?: TypeInfo;
  is_async?: boolean;
  params?: ParamData[];
  body?: string;
  generics?: GenericData[];
};

export type FunctionJson = {
  name?: string;
  return_type?: string;
  is_async?: boolean;
  params?: (ParamJson | string)[];
  body?: string;
  generics?: (GenericJson | string)[];
};

export class FunctionTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): FunctionData {
    let name: string;
    let params: ParamData[] = [];
    let returnType: TypeInfo;
    let isAsync: boolean;
    let body: string;
    let generics: GenericData[] = [];

    const match = str.match(FUNCTION_REGEX);

    if (Array.isArray(match)) {
      isAsync = !!match[1];

      if (match[2]) {
        let temp = match[2].trim();
        name = temp;
        if (ConfigInstruction.isUseInstruction(temp)) {
          name = ConfigUseInstruction.getValue(temp, addons);
        }
      }

      body = match[10]?.trim();

      if (match[8]) {
        let temp = match[8].trim();
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

      SchemaTools.splitIgnoringBrackets(match[4], ",").forEach((str) => {
        generics.push(
          GenericTools.stringToData(str, reserved, dependencies, addons)
        );
      });
      SchemaTools.splitIgnoringBrackets(match[6], ",").forEach((str) => {
        params.push(
          ParamTools.stringToData(str, reserved, dependencies, addons)
        );
      });
    } else {
      throw new Error(`Function regex match failure`);
    }

    return {
      name,
      params,
      return_type: returnType,
      is_async: isAsync,
      body,
      generics,
    };
  }
}

export class FunctionSchema {
  public static create(
    data: FunctionData | FunctionJson | string,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): FunctionSchema {
    if (!data) {
      return null;
    }

    let name: string;
    let params: ParamSchema[] = [];
    let returnType: TypeInfo;
    let isAsync: boolean;
    let body: string;
    let generics: GenericSchema[] = [];

    if (typeof data === "string") {
      const fn = FunctionTools.stringToData(
        data,
        reserved,
        dependencies,
        addons
      );

      name = fn.name;
      params = fn.params.map((p) =>
        ParamSchema.create(p, reserved, dependencies, addons)
      );
      returnType = fn.return_type;
      isAsync = fn.is_async;
      body = fn.body;
      generics = fn.generics.map((g) =>
        GenericSchema.create(g, reserved, dependencies, addons)
      );
    } else {
      name = data.name;
      isAsync = data.is_async;
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
    }

    const fn = new FunctionSchema(name, returnType, isAsync, body);

    params.forEach((param) => {
      fn.addParam(param);
    });

    generics.forEach((generic) => {
      fn.addGeneric(generic);
    });

    return fn;
  }

  private __params: ParamSchema[] = [];
  private __generics: GenericSchema[] = [];

  private constructor(
    public readonly name: string,
    public readonly returnType: TypeInfo,
    public readonly isAsync: boolean,
    public readonly body: string
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
    const { __params, __generics, body } = this;
    const fn: FunctionData = {
      params: __params.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      body,
    };

    return SchemaTools.removeNullUndefined(fn);
  }

  listTypes() {
    const { returnType, __params, __generics } = this;
    const types = [];

    __generics.forEach((g) => {
      types.push(...g.listTypes());
    });

    __params.forEach((p) => {
      types.push(...p.listTypes());
    });

    if (returnType) {
      types.push(returnType);
    }

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
