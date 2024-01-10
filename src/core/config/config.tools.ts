import { ParamSchema, PropSchema } from "../components";
import { TypeInfo } from "../type.info";
import { ReservedType } from "./config.types";

export type InstructionData = { [key: string]: any; dependencies: any[] };
/*
{{IF DEPENDENCY(WHERE type.isModel IS NOT true).type IS true}}
{{USE DEPENDENCY(WHERE type.type IS input).element.name}}
{{USE DEPENDENCY(WHERE type.type IS input).element.name}}
{{USE DEPENDENCY(WHERE type.type IS input).element.name TO BUILD Array<Param>}}
{{USE addons.path TO BUILD Foo}}
{{USE addons.table}}

0: "{{USE DEPENDENCY(WHERE type.type IS input).element.name TO BUILD Array<Param>}}"
1: "USE"
2: "DEPENDENCY(WHERE type.type IS input)."
3: "type.type"
4: " IS "
5: "input"
6: "element.name"
7: " TO BUILD "
8: "Array<Param>"
*/
const instruction_regex =
  /{{\s*(USE|IF)\s+(DEPENDENCY\([A-Z ]+([a-zA-Z.0-9_]+)(\s+[A-Z=\>\<\! ]+\s+)?([a-zA-Z0-9\"\'\_\- ]+)?\).?)?([a-z.A-Z0-9\[\]-_\(\)]+)(\s+[A-Z_ ]+\s+)?([^}]+)?\s*}}/;

export class ConfigTools {
  static hasInstructions(value: string) {
    return new RegExp(instruction_regex, "g").test(value);
  }

  static executeInstructions(
    value: string,
    data: InstructionData,
    reserved: ReservedType[]
  ): any {
    const instruction_match = value.match(new RegExp(instruction_regex, "g"));

    if (Array.isArray(instruction_match)) {
      if (instruction_match.length === 1) {
        return this.parseInstruction(instruction_match[0], data, reserved);
      }

      let result = value;
      instruction_match.forEach((match) => {
        const parsed = this.parseInstruction(match, data, reserved);
        result = result.replace(match, parsed);
      });

      return result;
    }
  }

  private static parseInstruction(
    str: string,
    data: InstructionData,
    reserved: ReservedType[]
  ): any {
    const [
      ref,
      instruction,
      dependency_instruction,
      dependency_path,
      dependency_operator,
      dependency_value,
      path,
      command,
      target,
    ] = str.match(instruction_regex);

    if (dependency_instruction && data.dependencies.length === 0) {
      return "PARSE_ERROR # MISSING DEPENDENCIES";
    }

    let o;

    if (dependency_instruction) {
      o = this.getDependencyByCondition(
        data.dependencies,
        dependency_path,
        dependency_operator,
        dependency_value
      );
    } else {
      o = data;
    }

    const value = this.getValueFromPath(o, path.trim());

    if (instruction === "USE" && command?.trim() === "TO BUILD") {
      return this.parseBuild(value, target, data, reserved);
    }

    if (instruction === "IF" && command) {
      return this.metCondition(command, value, target);
    }

    return value;
  }

  private static parseBuild(
    ref: any,
    element: string,
    data: InstructionData,
    reserved: ReservedType[]
  ): any[] | any {
    const refs = Array.isArray(ref) ? ref : [ref];
    const array_match = element.toLowerCase().match(/array<(.+)>/);
    const result = [];
    let target;

    if (array_match) {
      target = array_match[1];
    } else {
      target = element.toLowerCase();
    }

    refs.forEach((r) => {
      if (target === "param") {
        result.push(ParamSchema.create(r, reserved, data));
      } else if (target === "prop") {
        result.push(PropSchema.create(r, reserved, data));
      } else if (target === "typeinfo" || target === "type") {
        result.push(TypeInfo.create(r, reserved));
      }
    });

    return array_match ? result : result[0];
  }

  private static getValueFromPath(data: InstructionData, path: string): any {
    return path.split(".").reduce((acc, part) => acc && acc[part], data);
  }

  private static metCondition(operator, value, expected) {
    const op = operator.trim().toLowerCase();

    if (
      ((op === "=" || op === "==" || op === "===" || op === "is") &&
        value ==
          (expected.toLowerCase() === "true"
            ? true
            : expected.toLowerCase() === "false"
            ? false
            : expected)) ||
      ((op === "!==" || op === "!=" || op === "is not" || op === "not") &&
        value ===
          (expected.toLowerCase() === "true"
            ? true
            : expected.toLowerCase() === "false"
            ? false
            : expected)) ||
      ((op === ">" || op === "gt") && value > expected) ||
      ((op === "<" || op === "lt") && value < expected) ||
      ((op === ">=" || op === "gte") && value >= expected) ||
      ((op === "<=" || op === "lte") && value <= expected)
    ) {
      return true;
    }

    return false;
  }

  private static getDependencyByCondition(
    dependencies: any[],
    path: string,
    operator: string,
    value: string
  ): any {
    for (const d of dependencies) {
      if (typeof d === "object") {
        const v = this.getValueFromPath(d, path);

        if (this.metCondition(operator, v, value)) {
          return d;
        }
      }
    }
  }
}
