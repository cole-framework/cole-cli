export type DatabaseMappingData = {
  db_type: string;
  code_type: string;
};
export type DatabaseConfigData = {
  name: string;
  alias: string;
  case_style?: string;
  imports?: { driver: { path: string }; storage: { path: string } };
  mappings?: DatabaseMappingData[];
};

export type DatabaseMapping = {
  dbType: string;
  codeType: string;
};
