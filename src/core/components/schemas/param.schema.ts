import { camelCase } from "change-case";
import { ConfigTools, ReservedType } from "../../config";
import { AccessType } from "../../enums";
import { TypeInfo, UnknownType } from "../../type.info";
import { SchemaTools } from "../schema.tools";

export const PARAM_REGEX =
  /^(inject)?\s*(private|protected|public)?\s*(readonly)?\s*([a-zA-Z0-9_]+)(\?)?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\}\|\& ]+))?(\s*=\s*(.+))?$/;

export type ParamData = {
  name?: string;
  type?: TypeInfo;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  value?: unknown;
};
export type ParamJson = {
  name?: string;
  type?: string;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  value?: unknown;
};

export class ParamTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ): ParamData {
    let name: string;
    let type: TypeInfo;
    let value: unknown;
    let isReadonly: boolean;
    let isOptional: boolean;
    let access: string;

    const match = str.match(PARAM_REGEX);

    if (Array.isArray(match)) {
      if (match[4]) {
        const temp = match[4].trim();
        if (ConfigTools.hasInstructions(temp)) {
          name = ConfigTools.executeInstructions(temp, references, reserved);
        } else {
          name = temp;
        }
      }

      if (match[7]) {
        const temp = match[7].trim();
        if (ConfigTools.hasInstructions(temp)) {
          type = ConfigTools.executeInstructions(temp, references, reserved);
        } else {
          type = TypeInfo.create(temp, reserved);
        }
      } else {
        type = new UnknownType();
      }

      if (match[9]) {
        const temp = match[9].trim();
        if (ConfigTools.hasInstructions(temp)) {
          value = ConfigTools.executeInstructions(temp, references, reserved);
        } else {
          value = temp;
        }
      }

      isReadonly = !!match[3];
      isOptional = !!match[5];
      access = match[2]?.trim() || AccessType.Public;
    } else {
      throw new Error(`Param regex match failure`);
    }

    return {
      name,
      type,
      value,
      is_readonly: isReadonly,
      is_optional: isOptional,
      access,
    };
  }

  static arrayToData(
    data: (string | ParamJson)[],
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") {
          return ParamTools.stringToData(item, reserved, references);
        }
        let value;
        let type;
        let name;

        if (typeof item.value === "string") {
          const temp = item.value.trim();
          if (ConfigTools.hasInstructions(temp)) {
            value = ConfigTools.executeInstructions(temp, references, reserved);
          } else {
            value = temp;
          }
        } else {
          value = SchemaTools.parseValue(item.value, (value) => {
            return ConfigTools.hasInstructions(value)
              ? ConfigTools.executeInstructions(value, references, reserved)
              : value;
          });
        }

        if (typeof item.type === "string") {
          const temp = item.type.trim();
          if (ConfigTools.hasInstructions(temp)) {
            type = ConfigTools.executeInstructions(temp, references, reserved);
          } else {
            type = TypeInfo.create(temp, reserved);
          }
        }

        if (typeof item.name === "string") {
          const temp = item.name.trim();
          if (ConfigTools.hasInstructions(temp)) {
            name = ConfigTools.executeInstructions(temp, references, reserved);
          } else {
            name = temp;
          }
        } else {
          name = item.name;
        }

        return {
          name,
          type,
          access: item.access,
          is_optional: item.is_optional,
          is_readonly: item.is_readonly,
          value,
        };
      });
    }
    return [];
  }
}

export class ParamSchema {
  public static create(
    data: string | ParamJson | ParamData,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ): ParamSchema {
    if (!data) {
      return null;
    }

    let name: string;
    let type: TypeInfo;
    let value: unknown;
    let isReadonly: boolean;
    let isOptional: boolean;
    let access: string;

    if (typeof data === "string") {
      const param = ParamTools.stringToData(data, reserved, references);
      name = param.name;
      type = param.type;
      value = param.value;
      isReadonly = param.is_readonly;
      isOptional = param.is_optional;
      access = param.access;
    } else {
      name = data.name;
      isOptional = data.is_optional;
      isReadonly = data.is_readonly;
      access = data.access || AccessType.Public;

      if (typeof data.type === "string") {
        let temp = data.type.trim();
        if (ConfigTools.hasInstructions(temp)) {
          type = ConfigTools.executeInstructions(temp, references, reserved);
        } else {
          type = TypeInfo.create(temp, reserved);
        }
      } else if (TypeInfo.isType(data.type)) {
        type = data.type;
      } else {
        type = new UnknownType();
      }

      if (typeof data.value === "string") {
        const temp = data.value.trim();
        if (ConfigTools.hasInstructions(temp)) {
          value = ConfigTools.executeInstructions(temp, references, reserved);
        } else {
          value = temp;
        }
      } else {
        value = SchemaTools.parseValue(data.value, (value) => {
          return ConfigTools.hasInstructions(value)
            ? ConfigTools.executeInstructions(value, references, reserved)
            : value;
        });
      }

      const tempName = data.name.trim();
      if (ConfigTools.hasInstructions(tempName)) {
        name = ConfigTools.executeInstructions(tempName, references, reserved);
      } else {
        name = tempName;
      }
    }

    return new ParamSchema(
      camelCase(name),
      type,
      access,
      isOptional,
      isReadonly,
      value
    );
  }

  private constructor(
    public readonly name: string,
    public readonly type: TypeInfo,
    public readonly access: string,
    public readonly isOptional: boolean,
    public readonly isReadonly: boolean,
    public readonly value: any
  ) {}

  toObject() {
    const {
      name,
      type,
      access,
      isOptional: is_optional,
      isReadonly: is_readonly,
      value,
    } = this;

    return {
      name,
      type,
      access,
      is_optional,
      is_readonly,
      value,
    };
  }

  listTypes() {
    const { type } = this;
    return [type];
  }
}
