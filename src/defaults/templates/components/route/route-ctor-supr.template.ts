import { ConstructorTemplateModel, ParamTemplateModel } from "../../../../core";
import { ArgumentTemplate } from "../../typescript/argument.template";

export class RouteCtorSuprTemplate {
  static parse(model: ConstructorTemplateModel): string {
    if (model.params.length > 0) {
      return `super(${model.params
        .reduce((acc, p) => {
          if (p) {
            if (p.value?.io) {
              acc.push(`{ io: new ${p.value.io}() }`);
            } else {
              acc.push(ArgumentTemplate.parse(p));
            }
          }

          return acc;
        }, [])
        .join(", ")});`;
    }

    return "super();";
  }
}
