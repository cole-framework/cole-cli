import { ConfigAddons, ConfigTools, ReservedType } from "../../config";
import { AccessType } from "../../enums";
import { TypeInfo, UnknownType } from "../../type.info";
import { SchemaTools } from "../schema.tools";
import {
  GenericData,
  GenericJson,
  GenericTools,
  GenericSchema,
  GenericObject,
} from "./generic.schema";
import {
  ParamData,
  ParamJson,
  ParamTools,
  ParamSchema,
  ParamObject,
} from "./param.schema";

export const METHOD_REGEX =
  /^(static|async|private|protected|public)?\s*(static|async|private|protected|public)?\s*(async|static|private|protected|public)?\s*([a-zA-Z0-9_]+)(\s*\<(.+)\>\s*)?(\((.*)\))?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\\}]+))?(\s*=>\s*(.*))?$/;

export type MethodObject = {
  access: string;
  name: string;
  return_type: TypeInfo;
  is_async: boolean;
  is_static: boolean;
  params: ParamObject[];
  body: string;
  supr: MethodObject;
  generics: GenericObject[];
};

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
  params?: string | (ParamJson | string)[];
  body?: string;
  supr?: MethodJson;
  generics?: (GenericJson | string)[];
};

export type MethodConfig = MethodJson & ConfigAddons;

export class MethodTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
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
        if (ConfigTools.hasInstructions(temp)) {
          name = ConfigTools.executeInstructions(temp, references, reserved);
        } else {
          name = temp;
        }
      }

      if (match[10]) {
        let temp = match[10].trim();
        if (ConfigTools.hasInstructions(temp)) {
          temp = ConfigTools.executeInstructions(temp, references, reserved);
        }
        returnType = TypeInfo.isType(temp)
          ? temp
          : TypeInfo.create(temp, reserved);
      } else {
        returnType = new UnknownType();
      }

      body = match[12]?.trim();

      SchemaTools.splitIgnoringBrackets(match[6], ",").forEach((str) => {
        generics.push(GenericTools.stringToData(str, reserved, references));
      });
      SchemaTools.splitIgnoringBrackets(match[8], ",").forEach((str) => {
        params.push(ParamTools.stringToData(str, reserved, references));
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
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") {
          return MethodTools.stringToData(item, reserved, references);
        }
        let name = item.name;
        let return_type;

        if (typeof item.return_type === "string") {
          let temp = item.return_type.trim();
          if (ConfigTools.hasInstructions(temp)) {
            temp = ConfigTools.executeInstructions(temp, references, reserved);
          }
          return_type = TypeInfo.isType(temp)
            ? temp
            : TypeInfo.create(temp, reserved);
        }

        const tempName = item.name.trim();
        if (ConfigTools.hasInstructions(tempName)) {
          name = ConfigTools.executeInstructions(
            tempName,
            references,
            reserved
          );
        } else {
          name = tempName;
        }

        return {
          name,
          params: Array.isArray(item.params)
            ? ParamTools.arrayToData(item.params, reserved, references)
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
    references?: { [key: string]: unknown; dependencies: any[] }
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
      const mth = MethodTools.stringToData(data, reserved, references);
      name = mth.name;
      access = mth.access;
      params = mth.params.map((p) =>
        ParamSchema.create(p, reserved, references)
      );
      returnType = mth.return_type;
      isAsync = mth.is_async;
      isStatic = mth.is_static;
      body = mth.body;
      generics = mth.generics.map((g) =>
        GenericSchema.create(g, reserved, references)
      );
    } else {
      access = data.access || AccessType.Public;
      isAsync = data.is_async;
      isStatic = data.is_static;
      body = data.body;

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

      if (data.supr) {
        if (SchemaTools.executeMeta(data.supr, references, reserved)) {
          supr = MethodSchema.create(data.supr, reserved, references);
        }
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

  toObject(): MethodObject {
    const {
      access,
      __params,
      __generics,
      body,
      supr,
      isAsync,
      isStatic,
      name,
      returnType,
    } = this;

    const mth: MethodObject = {
      access,
      params: __params.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      body,
      supr: supr?.toObject(),
      is_async: isAsync,
      is_static: isStatic,
      name,
      return_type: returnType,
    };

    return mth;
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
