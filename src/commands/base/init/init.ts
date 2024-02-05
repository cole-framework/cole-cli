import chalk from "chalk";
import { InitOptions } from "./types";
import { InitInteractiveStrategy } from "./init.interactive-strategy";
import { InitOptionsStrategy } from "./init.options-strategy";
import { Texts, localConfigPath } from "../../../core";
import { existsSync, mkdirSync } from "fs";
import { InteractionPrompts } from "../../api";
import { dirname } from "path";

export const init = async (options: InitOptions) => {
  const texts = Texts.load(true);

  if (existsSync(localConfigPath)) {
    const shouldContinue = await InteractionPrompts.continue(
      texts.get("configuration_file_detected_do_you_want_to_overwrite_it")
    );

    if (shouldContinue === false) {
      process.exit(0);
    }
  } else {
    mkdirSync(dirname(localConfigPath), { recursive: true });
  }

  if (Object.keys(options).length === 0) {
    new InitInteractiveStrategy().apply();
  } else {
    new InitOptionsStrategy().apply(options);
  }
};
