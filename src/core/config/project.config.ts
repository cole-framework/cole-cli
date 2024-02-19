import { ProjectDescription } from "@cole-framework/cole-cli-core";

export class ProjectConfig {
  static create(project: ProjectDescription) {
    const {
      language,
      database,
      web_framework,
      service,
      source,
      dependency_injection,
      name,
      author,
      description,
      license,
    } = project;
    return new ProjectConfig(
      language,
      database,
      web_framework,
      service,
      source,
      dependency_injection,
      name,
      author,
      description,
      license
    );
  }

  constructor(
    public readonly language: string,
    public readonly database: string[],
    public readonly web_framework: string,
    public readonly service: string,
    public readonly source: string,
    public readonly dependency_injection: string,
    public readonly name: string,
    public readonly author: string,
    public readonly description: string,
    public readonly license: string
  ) {}
}
