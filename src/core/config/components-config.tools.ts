import { basename, join } from "path";
import { Pattern } from "./tools/pattern";
import { GeneratedPath } from "./config.types";

export class ComponentsConfigTools {
  public static generateName(
    pattern: string,
    replacements: { [key: string]: string }
  ): string {
    return Pattern.replace(pattern, replacements);
  }

  public static generatePath(
    pattern: string,
    replacements: { root?: string; [key: string]: string },
    options?: { useCwd?: boolean }
  ): GeneratedPath {
    let [path, marker] = pattern.split("#");
    const filename = basename(path);
    const hasDynamicFilename = /{{\s*\w+\s*}}/.test(filename);

    if (options?.useCwd) {
      return {
        marker,
        path: join(process.cwd(), filename),
        hasDynamicFilename,
      };
    }

    const rootMatch = path.match(/{{\s*root\s*}}/g);

    if (replacements.root && rootMatch) {
      path = path.replace(rootMatch[0], replacements.root);
    }

    return {
      marker,
      path: Pattern.replace(path, replacements),
      hasDynamicFilename,
    };
  }

  public static extractPathParams(path: string): string[] {
    const params = new Set<string>();
    const pathParams = path.match(/:\w+/g);

    if (Array.isArray(pathParams)) {
      pathParams.forEach((match) => {
        params.add(match.substring(1));
      });
    }
    return [...params];
  }

  static listTypes(defaults) {
    const list: string[] = [];
    const defKeys = Object.keys(defaults);
    defKeys.forEach((defKey) => {
      if (defKey === "imports" && Array.isArray(defaults["imports"])) {
        defaults["imports"].forEach((i) => {
          if (Array.isArray(i.list)) {
            i.list.forEach((j) => {
              if (j && typeof j === "string") {
                list.push(j);
              }
            });
          }
        });
      } else if (defKey === "props" && Array.isArray(defaults["props"])) {
        defaults["props"].forEach((prop) => {
          if (prop.type && typeof prop.type === "string") {
            list.push(prop.type);
          }
        });
      } else if (defKey === "methods" && Array.isArray(defaults["methods"])) {
        defaults["methods"].forEach((mth) => {
          if (mth.return_type && typeof mth.return_type === "string") {
            list.push(mth.return_type);
          }

          if (Array.isArray(mth.supr?.params)) {
            mth.supr?.params.forEach((param) => {
              if (param.type && typeof param.type === "string") {
                list.push(param.type);
              }
            });
          }

          if (Array.isArray(mth.params)) {
            mth.params.forEach((param) => {
              if (param.type && typeof param.type === "string") {
                list.push(param.type);
              }
            });
          }
        });
      } else if (defKey === "ctor") {
        if (Array.isArray(defaults["ctor"]?.supr?.params)) {
          defaults["ctor"]?.supr?.params.forEach((param) => {
            if (param.type && typeof param.type === "string") {
              list.push(param.type);
            }
          });
        }

        if (Array.isArray(defaults["ctor"]?.params)) {
          defaults["ctor"].params.forEach((param) => {
            if (param.type && typeof param.type === "string") {
              list.push(param.type);
            }
          });
        }
      } else if (defKey === "generics" && Array.isArray(defaults["generics"])) {
        defaults["generics"].forEach((generic) => {
          if (generic.inheritance && typeof generic.inheritance === "string") {
            list.push(generic.inheritance);
          }

          if (generic.dflt && typeof generic.dflt === "string") {
            list.push(generic.dflt);
          }
        });
      } else if (
        defKey === "interfaces" &&
        Array.isArray(defaults["interfaces"])
      ) {
        defaults["interfaces"].forEach((intf) => {
          if (intf && typeof intf === "string") {
            list.push(intf);
          }
        });
      } else if (defKey === "inheritance" && defaults["inheritance"]) {
        list.push(defaults["inheritance"].name);
        if (Array.isArray(defaults["inheritance"]["generics"])) {
          defaults["inheritance"]["generics"].forEach((generic) => {
            if (
              generic.inheritance &&
              typeof generic.inheritance === "string"
            ) {
              list.push(generic.inheritance);
            }

            if (generic.dflt && typeof generic.dflt === "string") {
              list.push(generic.dflt);
            }
          });
        }
      } else {
        const result = ComponentsConfigTools.listTypes(defaults[defKey]);
        list.push(...result);
      }
    });

    return list;
  }
}

