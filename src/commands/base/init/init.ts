import chalk from "chalk";
import { InitOptions } from "./types";
import { InitInteractiveStrategy } from "./init.interactive-strategy";
import { InitOptionsStrategy } from "./init.options-strategy";
import { ConfigLoader, Texts, localConfigPath } from "../../../core";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { InteractionPrompts } from "../../api";
import { dirname } from "path";

export const init = async (options: InitOptions) => {
  const { content: config, failure } = ConfigLoader.load();
  const texts = Texts.load();

  if (failure) {
    console.log(chalk.red(failure.error.message));
    process.exit(1);
  }

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
    new InitOptionsStrategy(config).apply(options);
  } else {
    new InitInteractiveStrategy(config).apply();
  }
};
