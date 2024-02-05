import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { globalLangPath, localLangPath } from "./consts";
import LANG from "../defaults/lang.json";
import { dirname } from "path";

type TextsContent = { [key: string]: string };

export class Texts {
  public static load(init?: boolean): Texts {
    let localLangExists = false;
    try {
      let content;
      if (existsSync(localLangPath)) {
        localLangExists = true;
        content = readFileSync(localLangPath, "utf-8");
      } else if (existsSync(globalLangPath)) {
        content = readFileSync(globalLangPath, "utf-8");
      }

      return new Texts(JSON.parse(content));
    } catch (error) {
      if (init) {
        if (localLangExists === false) {
          mkdirSync(dirname(localLangPath), { recursive: true });
        }
        writeFileSync(localLangPath, JSON.stringify(LANG, null, 2));
      }

      return new Texts(LANG);
    }
  }

  constructor(private texts: TextsContent) {}

  public get(key: string): string {
    return this.texts[key] || key;
  }
}
