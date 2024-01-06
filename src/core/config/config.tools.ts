import { Component } from "../components";

export class ConfigDependencyInstruction {
  static getDependency(value: string, components: Component[]) {
    const [instruction, rest] = value.split(`#`);
    const chain = rest.split(".");
    const target = chain[0];

    return components.find((dep) => dep.type.name === target);
  }
}

export class ConfigUseInstruction {
  static getValue(value: string, addons: { [key: string]: any }) {
    const [instruction, key] = value.split(`#`);

    return addons ? addons[key] : null;
  }
}

export class ConfigInstruction {
  static isDependencyInstruction(value: string) {
    return /(dependency)\#[a-zA-Z0-9._\[\]]+/.test(value);
  }
  static isUseInstruction(value: string) {
    return /(use)\#[a-zA-Z0-9._\[\]]+/.test(value);
  }
}

export class ConfigTools {}
