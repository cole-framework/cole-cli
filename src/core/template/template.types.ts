export type TemplateHeader = {
  name: string;
  path: string;
  type: string;
};

export type TemplateModel = {
  // interfaces?: InterfaceSchema[];
  // classes?: ClassSchema[];
  // imports?: ImportSchema[];
  // exports?: ExportSchema[];
  // functions?: FunctionSchema[];
  // types?: TypeSchema[];
  // enums?: EnumSchema[];
  // tests?: UnitTestSchema[];
  // mocks?: MockSchema[];
  header: TemplateHeader;
  [key: string]: unknown;
};
