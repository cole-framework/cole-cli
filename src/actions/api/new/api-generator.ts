import { Transport } from "../../../transport/transport";
import {
  ComponentData,
  Config,
  Failure,
  Result,
  SourceCodeWriter,
} from "../../../core";
import { ApiConfig, ApiObject } from "./api.types";
import { FileTemplateModel } from "../../../core/template/file.template-model";
import { ApiSchema } from "./api.schema";

export const updateTemplateModel = (
  files: Map<string, FileTemplateModel>,
  data: ComponentData
) => {
  let file = files.get(data.path);

  if (!file) {
    file = new FileTemplateModel(data.path, data.write_method);
    files.set(data.path, file);
  }
  file.update(data);
};

export class ApiGenerator {
  constructor(protected transport: Transport) {}
  protected writeFiles(outputs: any[]): Result {
    const { transport } = this;
    const codeWriter = new SourceCodeWriter(transport);

    outputs.forEach((output) => codeWriter.add(output));
    const { error } = codeWriter.write();

    return error
      ? Result.withFailure(Failure.fromError(error))
      : Result.withoutContent();
  }

  protected createTemplateModels(api: ApiObject) {
    const templateModels = new Map<string, FileTemplateModel>();

    api.controllers.forEach((item) =>
      updateTemplateModel(templateModels, item)
    );
    api.entities.forEach((item) => updateTemplateModel(templateModels, item));
    api.mappers.forEach((item) => updateTemplateModel(templateModels, item));
    api.models.forEach((item) => updateTemplateModel(templateModels, item));
    api.repositories.forEach((item) =>
      updateTemplateModel(templateModels, item)
    );
    api.repository_factories.forEach((item) =>
      updateTemplateModel(templateModels, item)
    );
    api.repository_impls.forEach((item) =>
      updateTemplateModel(templateModels, item)
    );
    api.route_ios.forEach((item) => updateTemplateModel(templateModels, item));
    api.routes.forEach((item) => updateTemplateModel(templateModels, item));
    api.sources.forEach((item) => updateTemplateModel(templateModels, item));
    api.use_cases.forEach((item) => updateTemplateModel(templateModels, item));

    return Array.from(templateModels, ([, value]) => value);
  }

  public generate(api: ApiSchema): Result {
    const obj = api.toObject();
    const models = this.createTemplateModels(obj);

    console.log(JSON.stringify(models, null, 2));

    return Result.withoutContent();
  }
}
