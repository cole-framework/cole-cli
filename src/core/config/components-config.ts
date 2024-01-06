import { basename, join, resolve } from "path";
import { ComponentsConfigTools } from "./tools";
import { GeneratedPath } from "./config.types";
import {
  ComponentConfigData,
  ComponentsConfigData,
  FrameworkDefaults,
} from "./components-config.types";

export class ComponentConfig {
  public static create(
    root: string,
    type: string,
    data: ComponentConfigData
  ): ComponentConfig {
    const { name_pattern, path_pattern, template_path, defaults } = data;

    return new ComponentConfig(
      root,
      type,
      name_pattern,
      path_pattern,
      template_path,
      defaults
    );
  }

  constructor(
    public root: string,
    public type: string,
    public namePattern: string,
    public pathPattern: string,
    public templatePath: string,
    public defaults: {
      common?: FrameworkDefaults;
      [key: string]: FrameworkDefaults;
    }
  ) {}

  public isEndpointRequired(): boolean {
    return /{{\s*\w*\s*endpoint\s*}}/.test(this.pathPattern);
  }

  public hasDynamicFilename(): boolean {
    return /{{\s*\w*\s*\w+\s*}}/.test(basename(this.pathPattern));
  }

  public generateName(
    name: string,
    rest?: { type?: string; [key: string]: string }
  ): string {
    const { namePattern } = this;
    return ComponentsConfigTools.generateName(namePattern, {
      name,
      ...rest,
    });
  }

  public generatePath(
    replacements: {
      name?: string;
      endpoint?: string;
      type?: string;
      [key: string]: string;
    },
    options?: { useCwd?: boolean }
  ): GeneratedPath {
    const { pathPattern, root } = this;
    return ComponentsConfigTools.generatePath(pathPattern, {
      root: options?.useCwd ? process.cwd() : root,
      ...replacements,
    });
  }
}

export class ComponentsConfig {
  public static create(
    dirname: string,
    data: ComponentsConfigData
  ): ComponentsConfig {
    let rootPath = resolve(process.cwd());

    if (rootPath.endsWith(dirname) === false) {
      const sourceIndex = rootPath.lastIndexOf(dirname);
      if (sourceIndex !== -1) {
        rootPath = rootPath.substring(0, sourceIndex + dirname.length);
      } else {
        rootPath = join(rootPath, dirname);
      }
    }

    return new ComponentsConfig(
      rootPath,
      ComponentConfig.create(rootPath, "controller", data.controller),
      ComponentConfig.create(rootPath, "mapper", data.mapper),
      ComponentConfig.create(rootPath, "source", data.source),
      ComponentConfig.create(rootPath, "entity", data.entity),
      ComponentConfig.create(rootPath, "model", data.model),
      ComponentConfig.create(rootPath, "repository", data.repository),
      ComponentConfig.create(rootPath, "repository_impl", data.repository_impl),
      ComponentConfig.create(
        rootPath,
        "repository_factory",
        data.repository_factory
      ),
      ComponentConfig.create(rootPath, "use_case", data.use_case),
      ComponentConfig.create(rootPath, "route", data.route),
      ComponentConfig.create(rootPath, "route_model", data.route_model),
      ComponentConfig.create(rootPath, "route_io", data.route_io)
    );
  }

  constructor(
    public readonly rootPath: string,
    public readonly controller: ComponentConfig,
    public readonly mapper: ComponentConfig,
    public readonly source: ComponentConfig,
    public readonly entity: ComponentConfig,
    public readonly model: ComponentConfig,
    public readonly repository: ComponentConfig,
    public readonly repositoryImpl: ComponentConfig,
    public readonly repositoryFactory: ComponentConfig,
    public readonly useCase: ComponentConfig,
    public readonly route: ComponentConfig,
    public readonly routeModel: ComponentConfig,
    public readonly routeIO: ComponentConfig
  ) {}
}
