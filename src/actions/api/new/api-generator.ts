import { OutputBuilderFactory } from "./output-builder.factory";
import { Transport } from "../../../transport/transport";
import {
  Config,
  Failure,
  Result,
  SourceCodeWriter,
  TemplateEngine,
  TemplateModel,
} from "../../../core";

export class ApiGenerator {
  protected outputBuilderFactory: OutputBuilderFactory;
  protected templateEngine: TemplateEngine;

  constructor(protected config: Config, protected transport: Transport) {
    this.outputBuilderFactory = new OutputBuilderFactory();
    this.templateEngine = new TemplateEngine();
  }

  protected isTestableComponent(type: string) {
    return true;
  }

  protected createComponentOutputs(
    type: string,
    templateModels: TemplateModel[],
    apiModel: any
  ): any[] {
    const outputs: any[] = [];
    const { outputBuilderFactory, config } = this;
    const {
      config: { use_cwd, write_method, force },
    } = apiModel;
    const builder = outputBuilderFactory.create(type, config);

    if (builder) {
      const componentOutputs = builder.build(templateModels, {
        useCwd: use_cwd,
        force,
        writeMethod: write_method,
      });
      outputs.push(...componentOutputs);
    }

    return outputs;
  }

  protected createTemplateModels(
    components: any[],
    apiModel: any
  ): TemplateModel[] {
    const templateModels = [];

    // for (const model of components) {
    //   const templateModel = templateModelFactory.create(model, apiModel);
    //   templateModels.push(templateModel);
    // }

    return templateModels;
  }

  protected createUnitTestTemplateModels(
    models: TemplateModel[],
    apiModel: any
  ): TemplateModel[] {
    // return models.map((model) =>
    //   unitTestTemplateModelFactory.create(model, apiModel)
    // );
    return [];
  }

  protected writeFiles(outputs: any[]): Result {
    const { transport } = this;
    const codeWriter = new SourceCodeWriter(transport);

    outputs.forEach((output) => codeWriter.add(output));
    const { error } = codeWriter.write();

    return error
      ? Result.withFailure(Failure.fromError(error))
      : Result.withoutContent();
  }

  public generate(schema: any): Result {
    const { config } = this;

    // create and complete the api model based on the provided schema
    //const apiSchema = new ApiModelFactory(config).create(data);
    const componentTypes = Object.keys(schema.components) || [];
    const outputs: any[] = [];

    // generate models based on strategy
    // strategy selected based on

    console.log(JSON.stringify(schema, null, " "));
    return Result.withoutContent();
  }
}
