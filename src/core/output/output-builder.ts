import { TemplateEngine } from "../template/template-engine";
// import { TemplateModel } from "../template";
import { Config, ComponentConfig } from "../config";

type BuildOptions = { useCwd?: boolean; writeMethod: string; force: boolean };

export class OutputBuilder {
  protected templateEngine: TemplateEngine;

  constructor(public readonly type: string, public readonly config: Config) {
    this.templateEngine = new TemplateEngine();
    if (config.components[type]) {
      const component: ComponentConfig = config.components[type];
      this.templateEngine.registerTemplate(component.templatePath, {
        partial: true,
        name: type,
      });
    }
  }

  public build(models: any[], options: BuildOptions): any[] {
    return [];
  }
}
