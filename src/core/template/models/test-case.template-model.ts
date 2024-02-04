import {
  MethodObject,
  PropObject,
  TestCaseObject,
} from "../../components/schemas";

export class TestCaseTemplateModel {
  static create(schema: TestCaseObject) {
    const { name, methods, props, group, is_async } = schema;

    return new TestCaseTemplateModel(name, group, is_async, methods, props);
  }

  constructor(
    public name: string,
    public group: string,
    public is_async: boolean,
    public methods: MethodObject[],
    public props: PropObject[],
    public template?: string
  ) {}
}
