import { Config } from "../../../../core";
import { NewSourceInteractiveStrategy } from "./new-source.interactive-strategy";
import { NewSourceOptionsStrategy } from "./new-source.options-strategy";
import { NewSourceOptions } from "./types";

export const newSource = async (
  options: NewSourceOptions,
  config: Config,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewSourceOptionsStrategy(config).apply(options, cliPluginPackageName);
  } else {
    new NewSourceInteractiveStrategy(config).apply(cliPluginPackageName);
  }
};
