import {
  ParamData,
  ParamJson,
  ParamObject,
  ParamSchema,
  ParamTools,
} from "./param.schema";
import { Config, ConfigAddons, ConfigTools, ReservedType } from "../../config";
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
  template: string;
  supr: ConstructorObject;
};

export type ConstructorData = {
  access?: string;
  params?: ParamData[];
  body?: string;
  template?: string;
  supr?: ConstructorData;
};

export type ConstructorConfig = ConstructorJson & ConfigAddons;

export class ConstructorTools {
  static stringToData(
    str: string,
    config: Config,
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
        params.push(ParamTools.stringToData(str, config, references));
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
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    isSuper = false
  ) {
    let access: string = AccessType.Public;
    let body: string;
    let template: string;
    let supr: ConstructorSchema;
    let params: ParamSchema[] = [];

    if (typeof data === "string") {
      const ctor = ConstructorTools.stringToData(data, config, references);
      access = ctor.access;
      ctor.params.forEach((p) =>
        params.push(ParamSchema.create(p, config, references))
      );
    } else {
      body = data.body;
      access = data.access;

      if (data.supr) {
        supr = ConstructorSchema.create(data.supr, config, references, true);
      }

      if (Array.isArray(data.params)) {
        data.params.forEach((param) => {
          if (typeof param === "string") {
            if (ConfigTools.hasInstructions(param)) {
              const p = ConfigTools.executeInstructions(
                param,
                references,
                config
              );
              if (p) {
                params.push(p);
              }
            } else {
              params.push(ParamSchema.create(param, config, references));
            }
          } else {
            if (SchemaTools.executeMeta(param, references, config)) {
              params.push(ParamSchema.create(param, config, references));
            }
          }
        });
      } else if (typeof data.params === "string") {
        if (ConfigTools.hasInstructions(data.params)) {
          params = ConfigTools.executeInstructions(
            data.params,
            references,
            config
          );
        } else {
          if (SchemaTools.executeMeta(data.params, references, config)) {
            params.push(ParamSchema.create(data.params, config, references));
          }
        }
      }

      template = (<ConstructorData>data).template;
    }

    const ctor = new ConstructorSchema(access, body, supr, template);

    params.forEach((param) => {
      ctor.addParam(param);
    });

    return ctor;
  }

  private readonly __params: ParamSchema[] = [];

  private constructor(
    public readonly access: string,
    public readonly body: string,
    public readonly supr: ConstructorSchema,
    public readonly template: string,
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
    const { access, __params, body, supr, template } = this;
    const ctr: ConstructorObject = {
      access,
      params: __params.map((p) => p.toObject()),
      body,
      supr: supr?.toObject(),
      template
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
