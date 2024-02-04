import {
  ConstructorConfig,
  ExportConfig,
  GenericConfig,
  ImportConfig,
  InheritanceConfig,
  InterfaceConfig,
  MethodConfig,
  PropConfig,
} from "../components";

export type ComponentsConfigData = {
  [key: string]: ComponentConfigData;
};

export type FrameworkDefaults = {
  inheritance?: InheritanceConfig[];
  interfaces?: InterfaceConfig[];
  imports?: ImportConfig[];
  props?: PropConfig[];
  methods?: MethodConfig[];
  generics?: GenericConfig[];
  ctor?: ConstructorConfig;
  exp?: ExportConfig;
  tests?: any;
};

export type ComponentConfigData = {
  root?: string;
  type?: string;
  name_pattern?: string;
  path_pattern?: string;
  element_type?: string; // class, abstract_class, interface, type, function
  defaults?: {
    common?: FrameworkDefaults;
    [key: string]: FrameworkDefaults;
  };
};
