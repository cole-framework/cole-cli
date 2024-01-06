import { component } from "./templates/component.template";
import { unit_test } from "./templates/unit_test.template";

export type TemplateConfig = {
  name: string;
  content: string;
  partial: boolean;
  filename: string;
};

export const DefaultTemplates: TemplateConfig[] = [
  {
    name: "component",
    content: component,
    partial: false,
    filename: `component.hbs`,
  },
  {
    name: "unit_test",
    content: unit_test,
    partial: false,
    filename: `unit_test.hbs`,
  },
];
