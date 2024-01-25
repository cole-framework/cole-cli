import { Dependency } from "../components";
import { Config } from "../config";
import { TypeInfo } from "../type.info";

export class TemplateModelTools {
  static generateNameFromType(
    type: TypeInfo,
    dependencies: Dependency[],
    config: Config
  ) {
    let dflt = "unknown";

    if (type?.isComponentType) {
      const dependency = dependencies.find(
        (d) =>
          d.type.name === type.name &&
          d.type.type === type.type &&
          d.type.component === type.component
      );

      if (dependency) {
        return dependency.name;
      }

      return config.components.generateName(type) || dflt;
    }

    if (TypeInfo.isArray(type)) {
      const t = this.generateNameFromType(type.itemType, dependencies, config);

      return `Array<${t || dflt}>`;
    }

    if (TypeInfo.isSet(type)) {
      const t = this.generateNameFromType(type.itemType, dependencies, config);

      return `Set<${t || dflt}>`;
    }

    if (TypeInfo.isMap(type)) {
      const k = this.generateNameFromType(type.keyType, dependencies, config);
      const v = this.generateNameFromType(type.valueType, dependencies, config);

      return `Map<${k || dflt}, ${v || dflt}>`;
    }

    if (
      type?.isPrimitive ||
      type?.isDatabaseType ||
      type?.isFrameworkDefaultType
    ) {
      return type.name;
    }

    return dflt;
  }
}
