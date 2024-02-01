import { Config, ConfigAddons, ConfigTools, ReservedType } from "../../config";
import { TypeInfo } from "../../type.info";
import {
  InheritanceData,
  InheritanceObject,
  InheritanceSchema,
} from "./inheritance.schema";

export type GenericJson = {
  name?: string;
  inheritance?: string; // extends types, may use multiple with & or |
  dflt?: string; // default type, may use multiple with & or |
};

export type GenericObject = {
  name: string;
  inheritance: InheritanceObject;
  dflt: string;
};

export type GenericData = {
  name?: string;
  inheritance?: InheritanceData; // extends types, may use multiple with & or |
  dflt?: string; // default type, may use multiple with & or |
};

export type GenericConfig = GenericJson & ConfigAddons;

export class GenericTools {
  static stringToData(
    str: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ): GenericData {
    let inheritance;
    let name;
    let dflt;

    const match = str.match(
      /(\w+)\s*(extends\s+([a-zA-Z0-9_\<\>\[\] \|\&,]+))?(\s*=\s*([a-zA-Z0-9_\<\>\[\] \|\&,]+))?/
    );
    if (match[1]) {
      let temp = match[1].trim();
      if (ConfigTools.hasInstructions(temp)) {
        name = ConfigTools.executeInstructions(temp, references, config);
      } else {
        name = temp;
      }
    }

    if (match[3]) {
      let temp = match[3].trim();

      if (ConfigTools.hasInstructions(temp)) {
        inheritance = ConfigTools.executeInstructions(temp, references, config);
      } else {
        inheritance = TypeInfo.create(temp, config);
      }
    }

    if (match[5]) {
      let temp = match[5].trim();

      if (ConfigTools.hasInstructions(temp)) {
        dflt = ConfigTools.executeInstructions(temp, references, config);
      } else {
        dflt = TypeInfo.create(temp, config);
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
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    let inheritance;
    let name;
    let dflt;

    if (typeof data === "string") {
      const generic = GenericTools.stringToData(data, config, references);
      inheritance = generic.inheritance;
      name = generic.name;
      dflt = generic.dflt;
    } else {
      name = data.name;

      if (typeof data.name === "string") {
        let temp = data.name.trim();
        if (ConfigTools.hasInstructions(temp)) {
          name = ConfigTools.executeInstructions(temp, references, config);
        } else {
          name = temp;
        }
      }

      if (typeof data.dflt === "string") {
        let temp = data.dflt.trim();

        if (ConfigTools.hasInstructions(temp)) {
          dflt = ConfigTools.executeInstructions(temp, references, config);
        } else {
          dflt = temp;
        }
      } else {
        dflt = data.dflt;
      }

      if (typeof data.inheritance === "string") {
        let temp = data.inheritance.trim();

        if (ConfigTools.hasInstructions(temp)) {
          inheritance = ConfigTools.executeInstructions(
            temp,
            references,
            config
          );
        } else {
          inheritance = InheritanceSchema.create(temp, config, references);
        }
      } else {
        inheritance = InheritanceSchema.create(
          data.inheritance,
          config,
          references
        );
      }
    }

    return new GenericSchema(name, inheritance, dflt);
  }

  constructor(
    public readonly name: string,
    public readonly inheritance?: InheritanceSchema,
    public readonly dflt?: string
  ) {}

  toObject(): GenericObject {
    const { name, dflt, inheritance } = this;
    return {
      name,
      dflt,
      inheritance: inheritance?.toObject(),
    };
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
