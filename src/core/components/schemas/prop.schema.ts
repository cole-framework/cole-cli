import { camelCase } from "change-case";
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

export const PROP_REGEX =
  /^(inject)?\s*(private|protected|public)?\s*(static|readonly)?\s*([a-zA-Z0-9_]+)(\?)?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\}\|\& ]+))?(\s*=\s*(.+))?$/;

export type PropData = {
  name?: string;
  type?: TypeInfo;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  is_static?: boolean;
  value?: unknown;
};
export type PropJson = {
  name?: string;
  type?: string;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  is_static?: boolean;
  value?: unknown;
};

export type PropConfig = PropJson & ConfigAddons;

export class PropTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): PropData {
    let name: string;
    let type: TypeInfo;
    let value: unknown;
    let isReadonly: boolean;
    let isStatic: boolean;
    let isOptional: boolean;
    let access: string;

    const match = str.match(PROP_REGEX);

    if (Array.isArray(match)) {
      if (match[4]) {
        const temp = match[4].trim();
        if (ConfigInstruction.isUseInstruction(temp)) {
          name = ConfigUseInstruction.getValue(temp, addons);
        } else {
          name = temp;
        }
      }

      if (match[7]) {
        const temp = match[7].trim();
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
      } else {
        type = new UnknownType();
      }

      if (match[9]) {
        const temp = match[9].trim();
        if (ConfigInstruction.isUseInstruction(temp)) {
          value = ConfigUseInstruction.getValue(temp, addons);
        } else {
          value = temp;
        }
      }

      isReadonly = match[3] === "readonly";
      isStatic = match[3] === "static";
      isOptional = !!match[5];
      access = match[2]?.trim() || AccessType.Public;
    } else {
      throw new Error(`Prop regex match failure`);
    }

    return {
      name,
      type,
      value,
      is_readonly: isReadonly,
      is_static: isStatic,
      is_optional: isOptional,
      access,
    };
  }
  static arrayToData(
    data: (string | PropJson)[],
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ) {
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") {
          return PropTools.stringToData(item, reserved, dependencies, addons);
        }
        let value = item.value;
        let type;
        let name = item.name;

        if (typeof item.value === "string") {
          if (ConfigInstruction.isUseInstruction(item.value)) {
            value = ConfigUseInstruction.getValue(item.value, addons);
          }
        }

        if (typeof item.type === "string") {
          if (ConfigInstruction.isUseInstruction(item.type)) {
            type = TypeInfo.create(
              ConfigUseInstruction.getValue(item.type, addons),
              reserved
            );
          } else if (ConfigInstruction.isDependencyInstruction(item.type)) {
            const component = ConfigDependencyInstruction.getDependency(
              item.type,
              dependencies
            );
            type = TypeInfo.fromComponent(component);
          } else {
            type = TypeInfo.create(item.type, reserved);
          }
        }

        if (typeof item.name === "string") {
          if (ConfigInstruction.isUseInstruction(item.name)) {
            name = ConfigUseInstruction.getValue(item.name, addons);
          }
        }

        return {
          name,
          type,
          access: item.access,
          is_optional: item.is_optional,
          is_readonly: item.is_readonly,
          is_static: item.is_static,
          value,
        };
      });
    }
    return [];
  }
}

export class PropSchema {
  public static create(
    data: string | PropJson | PropData,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): PropSchema {
    if (!data) {
      return null;
    }

    let name: string;
    let type: TypeInfo;
    let value: unknown;
    let isReadonly: boolean;
    let isStatic: boolean;
    let isOptional: boolean;
    let access: string;

    if (typeof data === "string") {
      const prop = PropTools.stringToData(data, reserved, dependencies, addons);
      name = prop.name;
      isOptional = prop.is_optional;
      isReadonly = prop.is_readonly;
      isStatic = prop.is_static;
      type = prop.type;
      value = prop.value;
      access = prop.access || AccessType.Public;
    } else {
      isOptional = data.is_optional;
      isReadonly = data.is_readonly;
      isStatic = data.is_static;
      access = data.access || AccessType.Public;

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

      if (typeof data.value === "string") {
        const temp = data.value.trim();
        if (ConfigInstruction.isUseInstruction(temp)) {
          value = ConfigUseInstruction.getValue(temp, addons);
        } else {
          value = temp;
        }
      } else {
        value = data.value;
      }

      if (typeof data.name === "string") {
        const temp = data.name.trim();
        if (ConfigInstruction.isUseInstruction(temp)) {
          name = ConfigUseInstruction.getValue(temp, addons);
        } else {
          name = temp;
        }
      } else {
        name = data.name;
      }
    }

    return new PropSchema(
      camelCase(name),
      type,
      access,
      isOptional,
      isReadonly,
      isStatic,
      value
    );
  }

  private constructor(
    public readonly name: string,
    public readonly type: TypeInfo,
    public readonly access: string,
    public readonly isOptional: boolean,
    public readonly isReadonly: boolean,
    public readonly isStatic: boolean,
    public readonly value: any
  ) {}

  toObject() {
    const {
      name,
      type,
      access,
      isOptional: is_optional,
      isReadonly: is_readonly,
      isStatic: is_static,
      value,
    } = this;

    return {
      name,
      type,
      access,
      is_optional,
      is_readonly,
      is_static,
      value,
    };
  }

  listTypes() {
    const { type } = this;
    return [type];
  }
}
