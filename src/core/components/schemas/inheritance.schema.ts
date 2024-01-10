import { ConfigAddons, ConfigTools, ReservedType } from "../../config";
import { SchemaTools } from "../schema.tools";
import { GenericData, GenericJson, GenericSchema } from "./generic.schema";

export type InheritanceData = {
  generics?: GenericData[];
  name?: string;
};

export type InheritanceJson = {
  generics?: (GenericJson | string)[];
  name?: string;
};

export type InheritanceConfig = InheritanceJson & ConfigAddons;

export class InheritanceSchema {
  public static create(
    data: string | InheritanceData | InheritanceJson,
    reserved: ReservedType[],
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    if (!data) {
      return null;
    }

    let inth;
    let name: string;
    let generics = [];

    if (typeof data === "string") {
      const temp = data.trim();

      if (ConfigTools.hasInstructions(temp)) {
        name = ConfigTools.executeInstructions(temp, references, reserved);
      } else {
        name = temp;
      }
    } else {
      const temp = data.name.trim();

      if (ConfigTools.hasInstructions(temp)) {
        name = ConfigTools.executeInstructions(temp, references, reserved);
      } else {
        name = temp;
      }

      if (Array.isArray(data.generics)) {
        generics = [...data.generics];
      }
    }

    inth = new InheritanceSchema(name);

    generics.forEach((g) => {
      if (SchemaTools.executeMeta(g, references, reserved)) {
        inth.addGeneric(GenericSchema.create(g, reserved, references));
      }
    });

    return inth;
  }

  private __generics: GenericSchema[] = [];

  private constructor(public readonly name: string) {}

  addGeneric(generic: GenericSchema) {
    if (this.hasGeneric(generic) === false) {
      this.__generics.push(generic);
    }
  }

  findGeneric(name: string) {
    return this.__generics.find((p) => p.name === name);
  }

  hasGeneric(generic: GenericSchema) {
    return (
      this.__generics.findIndex(
        (g) =>
          g.name === generic.name &&
          g.dflt?.name === generic.dflt?.name &&
          g.inheritance?.name === generic.inheritance?.name
      ) !== -1
    );
  }

  get generics() {
    return [...this.__generics];
  }

  toObject() {
    const { name, __generics } = this;
    const intf: InheritanceData = {
      name,
      generics: __generics.map((g) => g.toObject()),
    };

    return SchemaTools.removeNullUndefined(intf);
  }

  listTypes() {
    const { __generics } = this;
    const list = [];

    __generics.forEach((g) => {
      list.push(...g.listTypes());
    });

    return list;
  }
}
