import {
  ParamData,
  ParamJson,
  ParamObject,
  ParamSchema,
  ParamTools,
} from "./param.schema";
import { Component } from "../component";
import { ConfigAddons, ReservedType } from "../../config";
import { AccessType } from "../../enums";
import { SchemaTools } from "../schema.tools";

export const CTOR_REGEX = /^(private|protected|public)?\s*(\((.*)\))$/;

export type ConstructorJson = {
  access?: string;
  params?: (ParamJson | string)[];
  body?: string;
  supr?: ConstructorJson;
};

export type ConstructorObject = {
  access: string;
  params: ParamObject[];
  body: string;
  supr: ConstructorObject;
};

export type ConstructorData = {
  access?: string;
  params?: ParamData[];
  body?: string;
  supr?: ConstructorData;
};

export type ConstructorConfig = ConstructorJson & ConfigAddons;

export class ConstructorTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ): ConstructorData {
    let access: string = AccessType.Public;
    const params: ParamData[] = [];

    const match = str.match(CTOR_REGEX);

    if (Array.isArray(match)) {
      if (match[1]) {
        access = match[1].trim();
      }
      SchemaTools.splitIgnoringBrackets(match[3], ",").forEach((str) => {
        params.push(ParamTools.stringToData(str, reserved, references));
      });
    } else {
      throw new Error(`Constructor regex match failure`);
    }

    return {
      access,
      params,
    };
  }
}

export class ConstructorSchema {
  public static create(
    data: ConstructorJson | ConstructorData | string,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    let access: string = AccessType.Public;
    let body: string;
    let supr: ConstructorSchema;
    const params: ParamSchema[] = [];

    if (typeof data === "string") {
      const ctor = ConstructorTools.stringToData(data, reserved, references);
      access = ctor.access;
      ctor.params.forEach((p) =>
        params.push(ParamSchema.create(p, reserved, references))
      );
    } else {
      body = data.body;
      access = data.access;

      if (data.supr) {
        supr = ConstructorSchema.create(data.supr, reserved, references);
      }

      if (Array.isArray(data.params)) {
        data.params.forEach((p) => {
          if (SchemaTools.executeMeta(p, references, reserved)) {
            params.push(ParamSchema.create(p, reserved, references));
          }
        });
      }
    }

    const ctor = new ConstructorSchema(access, body, supr);

    params.forEach((param) => {
      ctor.addParam(param);
    });

    return ctor;
  }

  private readonly __params: ParamSchema[] = [];

  private constructor(
    public readonly access: string,
    public readonly body: string,
    public readonly supr: ConstructorSchema
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

  toObject(): ConstructorObject {
    const { access, __params, body, supr } = this;
    const ctr: ConstructorObject = {
      access,
      params: __params.map((p) => p.toObject()),
      body,
      supr: supr?.toObject(),
    };

    if (supr) {
      ctr.supr = supr.toObject();
    }

    return ctr;
  }

  listTypes() {
    const { __params, supr } = this;
    const list = [];

    __params.forEach((p) => {
      list.push(...p.listTypes());
    });

    if (supr) {
      list.push(supr);
    }

    return list;
  }
}
