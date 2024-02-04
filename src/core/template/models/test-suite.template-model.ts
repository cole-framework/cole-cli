import { Dependency } from "../../components/component";
import { TestSuiteObject } from "../../components/schemas";
import { Config } from "../../config";
import { ImportTemplateModel } from "./import.template-model";
import { TestCaseTemplateModel } from "./test-case.template-model";

export class TestSuiteTemplateModel {
  static create(
    schema: TestSuiteObject,
    dependencies: Dependency[],
    config: Config
  ) {
    const { imports, name, tests, template } = schema;

    return new TestSuiteTemplateModel(
      name,
      Array.isArray(tests)
        ? tests.map((i) => TestCaseTemplateModel.create(i))
        : [],
      Array.isArray(imports)
        ? imports.map((i) => ImportTemplateModel.create(i))
        : [],
      template
    );
  }

  constructor(
    public name: string,
    public tests: TestCaseTemplateModel[],
    public imports: ImportTemplateModel[],
    public template: string
  ) {}
}
