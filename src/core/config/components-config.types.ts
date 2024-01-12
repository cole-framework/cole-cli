import {
  ConstructorConfig,
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
};

export type ComponentConfigData = {
  root?: string;
  type?: string;
  name_pattern?: string;
  path_pattern?: string;
  template_path?: string;
  defaults?: {
    common?: FrameworkDefaults;
    [key: string]: FrameworkDefaults;
  };
};
