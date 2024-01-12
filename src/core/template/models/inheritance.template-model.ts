import { InheritanceObject } from "../../components/schemas";
import { GenericTemplateModel } from "./generic.template-model";

export class InheritanceTemplateModel {
  static create(schema: InheritanceObject) {
    const { name, generics } = schema;
    return new InheritanceTemplateModel(
      name,
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : []
    );
  }

  constructor(public name: string, public generics: GenericTemplateModel[]) {}
}
