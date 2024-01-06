import {
  ConfigAddons,
  ReservedType,
  ConfigInstruction,
  ConfigUseInstruction,
  ConfigDependencyInstruction,
} from "../../config";
import { TypeInfo } from "../../type.info";
import { Component } from "../component";
import { SchemaTools } from "../schema.tools";

export type GenericJson = {
  name?: string;
  inheritance?: string; // extends types, may use multiple with & or |
  dflt?: string; // default type, may use multiple with & or |
};

export type GenericData = {
  name?: string;
  inheritance?: TypeInfo; // extends types, may use multiple with & or |
  dflt?: TypeInfo; // default type, may use multiple with & or |
};

export type GenericConfig = GenericJson & ConfigAddons;

export class GenericTools {
  static stringToData(
    str: string,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ): GenericData {
    let inheritance;
    let name;
    let dflt;

    const match = str.match(
      /(\w+)\s*(extends\s+([a-zA-Z0-9_\<\>\[\] \|\&,]+))?(\s*=\s*([a-zA-Z0-9_\<\>\[\] \|\&,]+))?/
    );
    if (match[1]) {
      let temp = match[1].trim();
      name = temp;
      if (ConfigInstruction.isUseInstruction(temp)) {
        name = TypeInfo.create(
          ConfigUseInstruction.getValue(temp, addons),
          reserved
        );
      }
    }

    if (match[3]) {
      let temp = match[3].trim();

      if (ConfigInstruction.isUseInstruction(temp)) {
        inheritance = TypeInfo.create(
          ConfigUseInstruction.getValue(temp, addons),
          reserved
        );
      } else if (ConfigInstruction.isDependencyInstruction(temp)) {
        const component = ConfigDependencyInstruction.getDependency(
          temp,
          dependencies
        );
        inheritance = TypeInfo.fromComponent(component);
      } else {
        inheritance = TypeInfo.create(temp, reserved);
      }
    }

    if (match[5]) {
      let temp = match[5].trim();

      if (ConfigInstruction.isUseInstruction(temp)) {
        dflt = TypeInfo.create(
          ConfigUseInstruction.getValue(temp, addons),
          reserved
        );
      } else if (ConfigInstruction.isDependencyInstruction(temp)) {
        const component = ConfigDependencyInstruction.getDependency(
          temp,
          dependencies
        );
        dflt = TypeInfo.fromComponent(component);
      } else {
        dflt = TypeInfo.create(temp, reserved);
      }
    }

    return {
      inheritance,
      name,
      dflt,
    };
  }
}

export class GenericSchema {
  public static create(
    data: string | GenericJson | GenericData,
    reserved: ReservedType[],
    dependencies: Component[],
    addons?: { [key: string]: unknown }
  ) {
    let inheritance;
    let name;
    let dflt;

    if (typeof data === "string") {
      const generic = GenericTools.stringToData(
        data,
        reserved,
        dependencies,
        addons
      );
      inheritance = generic.inheritance;
      name = generic.name;
      dflt = generic.dflt;
    } else {
      name = data.name;

      if (typeof data.name === "string") {
        if (ConfigInstruction.isUseInstruction(data.name)) {
          name = TypeInfo.create(
            ConfigUseInstruction.getValue(data.name, addons),
            reserved
          );
        }
      }

      if (typeof data.dflt === "string") {
        let temp = data.dflt.trim();

        if (ConfigInstruction.isUseInstruction(temp)) {
          dflt = TypeInfo.create(
            ConfigUseInstruction.getValue(temp, addons),
            reserved
          );
        } else if (ConfigInstruction.isDependencyInstruction(temp)) {
          const component = ConfigDependencyInstruction.getDependency(
            temp,
            dependencies
          );
          dflt = TypeInfo.fromComponent(component);
        } else {
          dflt = TypeInfo.create(temp, reserved);
        }
      } else {
        dflt = data.dflt;
      }

      if (typeof data.inheritance === "string") {
        let temp = data.inheritance.trim();

        if (ConfigInstruction.isUseInstruction(temp)) {
          inheritance = TypeInfo.create(
            ConfigUseInstruction.getValue(temp, addons),
            reserved
          );
        } else if (ConfigInstruction.isDependencyInstruction(temp)) {
          const component = ConfigDependencyInstruction.getDependency(
            temp,
            dependencies
          );
          inheritance = TypeInfo.fromComponent(component);
        } else {
          inheritance = TypeInfo.create(temp, reserved);
        }
      } else {
        inheritance = data.inheritance;
      }
    }

    return new GenericSchema(name, inheritance, dflt);
  }

  constructor(
    public readonly name: string,
    public readonly inheritance?: TypeInfo,
    public readonly dflt?: TypeInfo
  ) {}

  toObject() {
    const { name, dflt, inheritance } = this;
    return SchemaTools.removeNullUndefined({
      name,
      dflt,
      inheritance,
    });
  }

  listTypes() {
    const { dflt, inheritance } = this;
    const types = [];
    if (dflt) {
      types.push(dflt);
    }

    if (inheritance) {
      types.push(inheritance);
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
