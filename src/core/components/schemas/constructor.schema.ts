import { ParamData, ParamJson, ParamSchema, ParamTools } from "./param.schema";
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
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): ConstructorData {
    let access: string = AccessType.Public;
    const params: ParamData[] = [];

    const match = str.match(CTOR_REGEX);

    if (Array.isArray(match)) {
      if (match[1]) {
        access = match[1].trim();
      }
      SchemaTools.splitIgnoringBrackets(match[3], ",").forEach((str) => {
        params.push(
          ParamTools.stringToData(str, reserved, dependencies, addons)
        );
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
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ) {
    let access: string = AccessType.Public;
    let body: string;
    let supr: ConstructorSchema;
    const params: ParamSchema[] = [];

    if (typeof data === "string") {
      const ctor = ConstructorTools.stringToData(
        data,
        reserved,
        dependencies,
        addons
      );
      access = ctor.access;
      ctor.params.forEach((p) =>
        params.push(ParamSchema.create(p, reserved, dependencies, addons))
      );
    } else {
      body = data.body;
      access = data.access;

      if (data.supr) {
        supr = ConstructorSchema.create(
          data.supr,
          reserved,
          dependencies,
          addons
        );
      }

      if (Array.isArray(data.params)) {
        data.params.forEach((p) => {
          params.push(ParamSchema.create(p, reserved, dependencies, addons));
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

  toObject() {
    const { access, __params, body, supr } = this;
    const ctr: ConstructorData = {
      access,
      params: __params.map((p) => p.toObject()),
      body,
    };

    if (supr) {
      ctr.supr = supr.toObject();
    }

    return SchemaTools.removeNullUndefined(ctr);
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
