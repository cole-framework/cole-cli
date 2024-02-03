import { Dependency } from "../../components/component";
import { TypeObject, ExportObject } from "../../components/schemas";
import { Config } from "../../config";
import { TypeInfo } from "../../type.info";
import { GenericTemplateModel } from "./generic.template-model";
import { ImportTemplateModel } from "./import.template-model";
import { PropTemplateModel } from "./prop.template-model";

export class TypeTemplateModel {
  static create(
    schema: TypeObject,
    dependencies: Dependency[],
    config: Config
  ) {
    const { exp, props, generics, imports, name, alias } = schema;

    return new TypeTemplateModel(
      name,
      TypeInfo.isType(alias) ? alias.name : alias,
      exp,
      Array.isArray(props)
        ? props.map((i) => PropTemplateModel.create(i, dependencies, config))
        : [],
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : [],
      Array.isArray(imports)
        ? imports.map((i) => ImportTemplateModel.create(i))
        : []
    );
  }

  constructor(
    public name: string,
    public alias: string,
    public exp: ExportObject,
    public props: PropTemplateModel[],
    public generics: GenericTemplateModel[],
    public imports: ImportTemplateModel[]
  ) {}
}
