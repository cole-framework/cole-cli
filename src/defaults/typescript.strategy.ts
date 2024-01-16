import { ApiObject } from "../actions/api/new/api.types";
import {
  ComponentData,
  FileOutput,
  FileTemplateModel,
  Result,
  Strategy,
  fileOrDirExists,
} from "../core";
import { TypeScriptFileTemplate } from "./typescript.file-template";

export class TypeScriptFileOutputStrategy extends Strategy {
  public async apply(
    models: FileTemplateModel[]
  ): Promise<Result<FileOutput[]>> {
    const outputs: FileOutput[] = [];
    try {
      for (const model of models) {
        if (fileOrDirExists(model.path)) {
          // update file
        } else {
          const content = await TypeScriptFileTemplate.parse(model.content);
          const output = new FileOutput(model.path, model.wite_method, content);
          outputs.push(output);
        }
      }

      return Result.withContent(outputs);
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}

export class TypeScriptTemplateModelStrategy extends Strategy {
  private updateTemplateModel(
    files: Map<string, FileTemplateModel>,
    data: ComponentData
  ) {
    let file = files.get(data.path);

    if (!file) {
      file = new FileTemplateModel(data.path, data.write_method);
      files.set(data.path, file);
    }
    file.update(data);
  }
  public apply(api: ApiObject): Result<FileTemplateModel[]> {
    try {
      const templateModels = new Map<string, FileTemplateModel>();

      api.controllers.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.entities.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.mappers.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.models.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.repositories.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.repository_factories.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.repository_impls.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.route_ios.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.routes.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.sources.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.tools.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.use_cases.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );

      return Result.withContent(
        Array.from(templateModels, ([, value]) => value)
      );
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}
