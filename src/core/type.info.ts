import { pascalCase } from "change-case";

import { BasicType } from "./enums";
import { ReservedType } from "./config";

export type ComponentLabel =
  | "model"
  | "tool"
  | "entity"
  | "use_case"
  | "controller"
  | "mapper"
  | "repository"
  | "repository_impl"
  | "repository_factory"
  | "source"
  | "route"
  | "route_model"
  | "route_io";

export abstract class TypeInfo {
  public static areIdentical(a: TypeInfo, b: TypeInfo) {
    return (
      a.name === a.name && a.type === b.type && a.component === b.component
    );
  }

  public static createFrameworkType(
    name: string,
    generics: string[] = []
  ): TypeInfo {
    if (!name) {
      return new UnknownType();
    }

    return new FrameworkDefaultType(
      generics.length > 0
        ? `${pascalCase(name)}<${generics
            .map((i) => pascalCase(i))
            .join(", ")}>`
        : pascalCase(name)
    );
  }

  public static create(data: any, reserved?: ReservedType[]): TypeInfo {
    if (!data) {
      return new UnknownType();
    }

    const typeLC = data.toLowerCase();

    if (data.type?.name) {
      switch (data.type.name) {
        case "model": {
          return new ModelType(data.name, data.type.type);
        }
        case "route_model": {
          return new ModelType(data.name, data.type.type);
        }
        case "entity": {
          return new EntityType(data.name);
        }
        case "tool": {
          return new ToolType(data.name);
        }
        default: {
          return new UnknownType();
        }
      }
    }

    const entityMatch = typeLC.match(/^entity\s*<\s*(\w+)\s*>/i);
    if (entityMatch) {
      return new EntityType(entityMatch[1]);
    }

    const toolMatch = typeLC.match(/^tool\s*<\s*(\w+)\s*>/i);
    if (toolMatch) {
      return new EntityType(toolMatch[1]);
    }

    const modelMatch = typeLC.match(/^model\s*<\s*(\w+)\s*,?\s*(\w+)?\s*>/i);
    if (modelMatch) {
      return new ModelType(modelMatch[1], modelMatch[2]?.toLowerCase());
    }

    if (data.includes("|") || data.includes("&")) {
      const chain = new Set<TypeInfo | "|" | "&">();
      const match = data.match(/[a-zA-Z0-9<>, ]+|[|&]/g);
      match.forEach((str) => {
        if (str !== "|" && str !== "&") {
          chain.add(TypeInfo.create(str.trim()));
        } else {
          chain.add(str);
        }
      });
      const ch = [...chain];
      return new MultiType(
        ch.reduce((str, c) => {
          if (TypeInfo.isType(c)) {
            str += c.name;
          } else {
            str += c;
          }
          return str;
        }, ""),
        ch
      );
    }

    if (typeLC.includes(BasicType.Array) || typeLC.includes("[]")) {
      const t = /^array\s*<\s*([a-zA-Z0-9<>_ ]+)\s*>/.test(typeLC)
        ? data.match(/<([a-zA-Z0-9<>_ ]+)>/)[1]
        : data.replace("[]", "");

      const itemType = TypeInfo.create(t, reserved);

      return new ArrayType(`Array<${itemType.name}>`, itemType);
    }

    if (typeLC.includes(BasicType.Set)) {
      const t = data.match(/<([a-zA-Z0-9<>_ ]+)>/)[1];
      const itemType = TypeInfo.create(t, reserved);

      return new SetType(`Set<${itemType.name}>`, itemType);
    }

    if (typeLC.includes(BasicType.Map)) {
      const match = data.match(
        /<\s*([a-zA-Z0-9<>_ ]+)\s*,\s*([a-zA-Z0-9<>_ ]+)\s*>/
      );
      const map = {
        keyType: TypeInfo.create(match[1], reserved),
        valueType: TypeInfo.create(match[2], reserved),
      };

      return new MapType(
        `Map<${(map.keyType.name, map.valueType.name)}>`,
        map.keyType,
        map.valueType
      );
    }

    if (Array.isArray(reserved)) {
      for (const r of reserved) {
        if (r.name.toLowerCase() === typeLC) {
          if (r.category === "DatabaseType") {
            return new DatabaseType(data);
          } else if (r.category === "FrameworkDefault") {
            return new FrameworkDefaultType(data);
          } else if (r.category === "Primitive") {
            return new PrimitiveType(data);
          }
        }
      }
    }

    return new ModelType(data);
  }

  public static isArray(type: TypeInfo): type is ArrayType {
    return type.isArray;
  }

  public static isEntity(type: TypeInfo): type is EntityType {
    return type.isEntity;
  }

  public static isModel(type: TypeInfo): type is ModelType {
    return type.isModel;
  }

  public static isSet(type: TypeInfo): type is SetType {
    return type.isSet;
  }

  public static isMap(type: TypeInfo): type is MapType {
    return type.isMap;
  }

  public static isFrameworkDefault(
    type: TypeInfo
  ): type is FrameworkDefaultType {
    return type.isFrameworkDefaultType;
  }

  public static isMultiType(type: TypeInfo): type is MultiType {
    return type.isMultiType;
  }

  public static isIterableType(type: TypeInfo): boolean {
    return type.isIterable;
  }

  public static isComponentType(type: TypeInfo) {
    return type.isComponentType;
  }

  public static isUnknownType(type: TypeInfo): type is UnknownType {
    return type.isUnknownType;
  }

  public static isConfigInstructionType(
    type: TypeInfo
  ): type is ConfigInstructionType {
    return type.isConfigInstructionType;
  }

  public static isType(type: unknown): type is TypeInfo {
    return (
      type instanceof DatabaseType ||
      type instanceof FrameworkDefaultType ||
      type instanceof UnknownType ||
      type instanceof ModelType ||
      type instanceof EntityType ||
      type instanceof ToolType ||
      type instanceof ControllerType ||
      type instanceof SourceType ||
      type instanceof MapperType ||
      type instanceof UseCaseType ||
      type instanceof RepositoryType ||
      type instanceof RepositoryImplType ||
      type instanceof RepositoryFactoryType ||
      type instanceof RouteType ||
      type instanceof RouteIOType ||
      type instanceof ArrayType ||
      type instanceof SetType ||
      type instanceof MapType ||
      type instanceof MultiType ||
      type instanceof ConfigInstructionType ||
      type instanceof PrimitiveType
    );
  }

  constructor(
    public readonly name: string,
    public readonly isArray?: boolean,
    public readonly keyType?: TypeInfo,
    public readonly valueType?: TypeInfo,
    public readonly itemType?: TypeInfo,
    public readonly isSet?: boolean,
    public readonly isMap?: boolean,
    public readonly isIterable?: boolean,
    public readonly isPrimitive?: boolean,
    public readonly isUnknownType?: boolean,
    public readonly isDatabaseType?: boolean,
    public readonly isFrameworkDefaultType?: boolean,
    public readonly isMultiType?: boolean,
    public readonly isComponentType?: boolean,
    public readonly isEntity?: boolean,
    public readonly isTool?: boolean,
    public readonly isModel?: boolean,
    public readonly isSource?: boolean,
    public readonly isRepository?: boolean,
    public readonly isRepositoryImpl?: boolean,
    public readonly isRepositoryFactory?: boolean,
    public readonly isUseCase?: boolean,
    public readonly isController?: boolean,
    public readonly isMapper?: boolean,
    public readonly isRoute?: boolean,
    public readonly isRouteIO?: boolean,
    public readonly isRouteModel?: boolean,
    public readonly isConfigInstructionType?: boolean,
    public readonly type?: string,
    public readonly component?: string,
    public readonly chain?: (TypeInfo | "|" | "&")[]
  ) {}

  get ref() {
    return this.name;
  }
}

export class ConfigInstructionType {
  public readonly isConfigInstructionType = true;
  constructor(public readonly name: string) {}

  get ref() {
    return this.name;
  }
}

export class DatabaseType {
  public readonly isDatabaseType = true;
  constructor(public readonly name: string) {}

  get ref() {
    return this.name;
  }
}

export class FrameworkDefaultType {
  public readonly isFrameworkDefaultType = true;
  constructor(public readonly name: string) {}

  get ref() {
    return this.name;
  }
}

export class NullType {
  public readonly isPrimitive = true;
  public readonly name = BasicType.Null;

  constructor() {}

  get ref() {
    return this.name;
  }
}

export class NaNType {
  public readonly isPrimitive = true;
  public readonly name = BasicType.NaN;

  constructor() {}

  get ref() {
    return this.name;
  }
}

export class ObjectType {
  public readonly isPrimitive = true;
  public readonly name = BasicType.Object;

  constructor() {}

  get ref() {
    return this.name;
  }
}

export class UnknownType {
  public readonly isPrimitive = true;
  public readonly isUnknownType = true;
  public readonly name = BasicType.Unknown;

  constructor() {}

  get ref() {
    return this.name;
  }
}

export class ModelType {
  public readonly isModel = true;
  public readonly isComponentType = true;
  public readonly component = "model";
  constructor(
    public readonly name: string,
    public readonly type = "json"
  ) {}

  get ref() {
    return `Model<${this.name},${this.type}>`;
  }
}

export class ToolType {
  public readonly isTool = true;
  public readonly isComponentType = true;
  public readonly component = "tool";
  constructor(public readonly name: string) {}

  get ref() {
    return `Tool<${this.name}>`;
  }
}

export class EntityType {
  public readonly isEntity = true;
  public readonly isComponentType = true;
  public readonly component = "entity";
  constructor(public readonly name: string) {}

  get ref() {
    return `Entity<${this.name}>`;
  }
}

export class RouteType {
  public readonly isRoute = true;
  public readonly isComponentType = true;
  public readonly component = "route";
  constructor(
    public readonly name: string,
    public readonly type: string
  ) {}

  get ref() {
    return `Route<${this.name},${this.type}>`;
  }
}

export class RouteIOType {
  public readonly isRouteIO = true;
  public readonly isComponentType = true;
  public readonly component = "route_io";
  constructor(public readonly name: string) {}

  get ref() {
    return `RouteIO<${this.name}>`;
  }
}

export class RouteModelType {
  public readonly isRouteModel = true;
  public readonly isComponentType = true;
  public readonly component = "route_model";
  constructor(
    public readonly name: string,
    public readonly type: string
  ) {}

  get ref() {
    return `RouteModel<${this.name}>`;
  }
}

export class SourceType {
  public readonly isSource = true;
  public readonly isComponentType = true;
  public readonly component = "source";
  constructor(
    public readonly name: string,
    public readonly type: string
  ) {}

  get ref() {
    return `Source<${this.name},${this.type}>`;
  }
}

export class MapperType {
  public readonly isMapper = true;
  public readonly isComponentType = true;
  public readonly component = "mapper";
  constructor(
    public readonly name: string,
    public readonly type: string
  ) {}

  get ref() {
    return `Mapper<${this.name},${this.type}>`;
  }
}

export class UseCaseType {
  public readonly isUseCase = true;
  public readonly isComponentType = true;
  public readonly component = "use_case";
  constructor(public readonly name: string) {}

  get ref() {
    return `UseCase<${this.name}>`;
  }
}

export class RepositoryType {
  public readonly isRepository = true;
  public readonly isComponentType = true;
  public readonly component = "repository";
  constructor(public readonly name: string) {}

  get ref() {
    return `Repository<${this.name}>`;
  }
}

export class RepositoryImplType {
  public readonly isRepositoryImpl = true;
  public readonly isComponentType = true;
  public readonly component = "repository_impl";
  constructor(public readonly name: string) {}

  get ref() {
    return `RepositoryImpl<${this.name}>`;
  }
}

export class RepositoryFactoryType {
  public readonly isRepositoryFactory = true;
  public readonly isComponentType = true;
  public readonly component = "repository_factory";
  constructor(public readonly name: string) {}

  get ref() {
    return `RepositoryFactory<${this.name}>`;
  }
}

export class ControllerType {
  public readonly isController = true;
  public readonly isComponentType = true;
  public readonly component = "controller";
  constructor(public readonly name: string) {}

  get ref() {
    return `Controller<${this.name}>`;
  }
}

export class ArrayType {
  public readonly isPrimitive = true;
  public readonly isArray = true;
  public readonly isIterable = true;

  constructor(
    public readonly name: string,
    public readonly itemType: TypeInfo
  ) {}

  get ref() {
    return `Array<${this.itemType.ref}>`;
  }
}

export class SetType {
  public readonly isPrimitive = true;
  public readonly isSet = true;
  public readonly isIterable = true;

  constructor(
    public readonly name: string,
    public readonly itemType: TypeInfo
  ) {}

  get ref() {
    return `Set<${this.itemType.ref}>`;
  }
}

export class MapType {
  public readonly isPrimitive = true;
  public readonly isMap = true;
  public readonly isIterable = true;

  constructor(
    public readonly name: string,
    public readonly keyType: TypeInfo,
    public readonly valueType: TypeInfo
  ) {}

  get ref() {
    return `Map<${this.keyType.ref},${this.valueType.ref}>`;
  }
}

export class MultiType {
  public static create(chain: (TypeInfo | "|" | "&")[]): MultiType {
    const name = chain.reduce((str, c) => {
      str += typeof c === "string" ? c : (str += c.name);
      return str;
    }, "");
    return new MultiType(name, chain);
  }

  public readonly isMultiType = true;
  private readonly _ref: string;

  constructor(
    public readonly name: string,
    public readonly chain: (TypeInfo | "|" | "&")[]
  ) {
    this._ref = chain.reduce((name, c) => {
      if (TypeInfo.isType(c)) {
        name += c.ref;
      } else {
        name += ` ${c} `;
      }
      return name;
    }, "");
  }

  get ref() {
    return this._ref;
  }
}

export class PrimitiveType {
  public readonly isPrimitive = true;

  constructor(public readonly name: string) {}

  get ref() {
    return this.name;
  }
}
