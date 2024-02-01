export const use_template_regex =
  /{{TEMPLATE\s*\(([a-zA-Z0-9-_.]+)\)\s*}}/i;

export class BodyTemplateModel {
  static create(body: string) {
    let instruction;
    let templateName;
    let content;

    if (!body) {
      return new BodyTemplateModel(templateName, instruction, "");
    }

    const templateMatch = body.match(use_template_regex);

    if (templateMatch) {
      instruction = templateMatch[0];
      templateName = templateMatch[1];
    }

    return new BodyTemplateModel(templateName, instruction, content);
  }

  constructor(
    public readonly templateName: string,
    public readonly instruction: string,
    public readonly content: any
  ) {}
}
