import { TypeInfo } from "../type.info";

export class TemplateModelTools {
  static generateNameFromType(type: TypeInfo) {
    return type?.name || "unknown";
  }
}
