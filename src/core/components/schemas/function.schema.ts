import { TypeInfo, UnknownType } from "../../type.info";
import {
  ParamData,
  ParamJson,
  ParamObject,
  ParamSchema,
  ParamTools,
} from "./param.schema";

import {
  GenericData,
  GenericJson,
  GenericObject,
  GenericSchema,
  GenericTools,
} from "./generic.schema";
import { ConfigTools, ReservedType } from "../../config";
import { SchemaTools } from "../schema.tools";
import {
  ExportData,
  ExportJson,
  ExportObject,
  ExportSchema,
} from "./export.schema";

export const foo = <T extends string | number>(foo: T) => {
  foo;
};

export const FUNCTION_REGEX =
  /^(async)?\s*([a-zA-Z0-9_]+)(\s*\<(.+)\>\s*)?(\((.*)\))?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\\}]+))?(\s*=>\s*(.*))?$/;

export type FunctionObject = {
  exp: ExportObject;
  name: string;
  return_type: TypeInfo;
  is_async: boolean;
  params: ParamObject[];
  body: string;
  generics: GenericObject[];
};

export type FunctionData = {
  exp?: ExportData;
  name?: string;
  return_type?: TypeInfo;
  is_async?: boolean;
  params?: ParamData[];
  body?: string;
  generics?: GenericData[];
};

export type FunctionJson = {
  exp?: string | boolean | ExportJson;
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
    references?: { [key: string]: unknown; dependencies: any[] }
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
        if (ConfigTools.hasInstructions(temp)) {
          name = ConfigTools.executeInstructions(temp, references, reserved);
        } else {
          name = temp;
        }
      }

      body = match[10]?.trim();

      if (match[8]) {
        let temp = match[8].trim();
        if (ConfigTools.hasInstructions(temp)) {
          temp = ConfigTools.executeInstructions(temp, references, reserved);
        }
        returnType = TypeInfo.isType(temp)
          ? temp
          : TypeInfo.create(temp, reserved);
      } else {
        returnType = new UnknownType();
      }

      SchemaTools.splitIgnoringBrackets(match[4], ",").forEach((str) => {
        generics.push(GenericTools.stringToData(str, reserved, references));
      });
      SchemaTools.splitIgnoringBrackets(match[6], ",").forEach((str) => {
        params.push(ParamTools.stringToData(str, reserved, references));
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
    references?: { [key: string]: unknown; dependencies: any[] }
  ): FunctionSchema {
    if (!data) {
      return null;
    }

    let exp: ExportSchema;
    let name: string;
    let params: ParamSchema[] = [];
    let returnType: TypeInfo;
    let isAsync: boolean;
    let body: string;
    let generics: GenericSchema[] = [];

    if (typeof data === "string") {
      const fn = FunctionTools.stringToData(data, reserved, references);

      name = fn.name;
      params = fn.params.map((p) =>
        ParamSchema.create(p, reserved, references)
      );
      returnType = fn.return_type;
      isAsync = fn.is_async;
      body = fn.body;
      generics = fn.generics.map((g) =>
        GenericSchema.create(g, reserved, references)
      );
    } else {
      name = data.name;
      isAsync = data.is_async;
      body = data.body;

      if (data.exp) {
        exp = ExportSchema.create(data.exp);
      }

      const tempName = data.name.trim();
      if (ConfigTools.hasInstructions(tempName)) {
        name = ConfigTools.executeInstructions(tempName, references, reserved);
      } else {
        name = tempName;
      }

      if (TypeInfo.isType(data.return_type)) {
        returnType = data.return_type;
      } else if (typeof data.return_type === "string") {
        let temp = data.return_type.trim();
        if (ConfigTools.hasInstructions(temp)) {
          temp = ConfigTools.executeInstructions(temp, references, reserved);
        }
        returnType = TypeInfo.isType(temp)
          ? temp
          : TypeInfo.create(temp, reserved);
      }

      if (Array.isArray(data.params)) {
        data.params.forEach((param) => {
          if (typeof param === "string") {
            if (ConfigTools.hasInstructions(param)) {
              const p = ConfigTools.executeInstructions(
                param,
                references,
                reserved
              );
              if (p) {
                params.push(p);
              }
            } else {
              params.push(ParamSchema.create(param, reserved, references));
            }
          } else {
            if (SchemaTools.executeMeta(param, references, reserved)) {
              params.push(ParamSchema.create(param, reserved, references));
            }
          }
        });
      } else if (typeof data.params === "string") {
        if (ConfigTools.hasInstructions(data.params)) {
          params = ConfigTools.executeInstructions(
            data.params,
            references,
            reserved
          );
        } else {
          if (SchemaTools.executeMeta(data.params, references, reserved)) {
            params.push(ParamSchema.create(data.params, reserved, references));
          }
        }
      }

      if (Array.isArray(data.generics)) {
        data.generics.forEach((g) => {
          if (SchemaTools.executeMeta(g, references, reserved)) {
            generics.push(GenericSchema.create(g, reserved, references));
          }
        });
      }
    }

    const fn = new FunctionSchema(exp, name, returnType, isAsync, body);

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
    public readonly exp: ExportSchema,
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

  toObject(): FunctionObject {
    const { __params, __generics, body, name, isAsync, returnType, exp } = this;
    const fn: FunctionObject = {
      exp: exp?.toObject(),
      params: __params.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      body,
      name,
      is_async: isAsync,
      return_type: returnType,
    };

    return fn;
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
