import Handlebars from "handlebars";
import { getRelativePath } from "../tools/files.tools";

export class RenderHelper {
  public static Token = "render";

  public static fn(
    partialName: string,
    context: unknown,
    options: Handlebars.HelperOptions
  ) {
    var partial = Handlebars.partials[partialName];
    if (!partial) {
      console.error("Could not find partial: " + partialName);
    } else {
      var newContext = Object.assign({}, this, context, options.hash);
      return new Handlebars.SafeString(partial(newContext));
    }
  }
}

export class RelativePathHelper {
  public static Token = "relative";

  public static fn(importPath: string, sourcePath?: string) {
    const relativePath = getRelativePath(importPath, sourcePath);

    if (!relativePath) {
      return `/* could not generate relative path */`;
    }

    return relativePath;
  }
}

export class CurlyBracesHelper {
  public static Token = "curly_braces";

  public static fn(content: unknown) {
    return `{${content}}`;
  }
}

export class NotEmptyHelper {
  public static Token = "not_empty";

  public static fn(arg: unknown) {
    return (
      ((typeof arg === "string" || Array.isArray(arg)) && arg.length > 0) ||
      (typeof arg === "object" && Object.keys(arg).length > 0)
    );
  }
}
export class AllDefinedHelper {
  public static Token = "all_defined";

  public static fn(...args: unknown[]) {
    return args.every((value) => !!value);
  }
}

export class JoinHelper {
  public static Token = "join";

  public static fn(array: string[], separator: string) {
    return Array.isArray(array) ? array.join(separator) : "";
  }
}

export class IncludesHelper {
  public static Token = "includes";

  public static fn(value: unknown, separator: string) {
    if (Array.isArray(value) || typeof value === "string") {
      return value.includes(separator);
    }

    if (typeof value === "object") {
      return Object.keys(value).includes(separator);
    }

    return false;
  }
}

export class EqHelper {
  public static Token = "eq";

  public static fn(a: unknown, b: unknown) {
    return a === b;
  }
}

export class NotHelper {
  public static Token = "not";

  public static fn(a: unknown, b?: unknown) {
    return b ? a !== b : !a;
  }
}

export class GtHelper {
  public static Token = "gt";

  public static fn(a: unknown, b: unknown) {
    return a > b;
  }
}

export class GteHelper {
  public static Token = "gte";

  public static fn(a: unknown, b: unknown) {
    return a >= b;
  }
}

export class LtHelper {
  public static Token = "lt";

  public static fn(a: unknown, b: unknown) {
    return a < b;
  }
}

export class LteHelper {
  public static Token = "lte";

  public static fn(a: unknown, b: unknown) {
    return a <= b;
  }
}
export class OrHelper {
  public static Token = "or";

  public static fn(a: unknown, b: unknown) {
    return a || b;
  }
}
