import { existsSync, readFileSync } from "fs";
import { globalLangPath, localLangPath } from "./consts";
import LANG from "../defaults/lang.json";

type TextsContent = { [key: string]: string };

export class Texts {
  public static load(): Texts {
    try {
      let content;
      if (existsSync(localLangPath)) {
        content = readFileSync(localLangPath, "utf-8");
      } else if (existsSync(globalLangPath)) {
        content = readFileSync(globalLangPath, "utf-8");
      }

      return new Texts(JSON.parse(content));
    } catch (error) {
      console.log(error);
      return new Texts(LANG);
    }
  }

  constructor(private texts: TextsContent) {}

  public get(key: string): string {
    return this.texts[key] || key;
  }
}
