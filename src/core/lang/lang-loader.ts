import { existsSync, readFileSync } from "fs";
import { globalLangPath, localLangPath } from "../consts";
import { Result } from "../result";
import LANG from "../../defaults/lang.json";

export class LangLoader {
  public static load(): Result<typeof LANG> {
    try {
      let content;
      if (existsSync(localLangPath)) {
        content = readFileSync(localLangPath, "utf-8");
      } else if (existsSync(globalLangPath)) {
        content = readFileSync(globalLangPath, "utf-8");
      }

      return Result.withContent(JSON.parse(content));
    } catch (error) {
      console.log(error);
      return Result.withContent(LANG);
    }
  }
}
