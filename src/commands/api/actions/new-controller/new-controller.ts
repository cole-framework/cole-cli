import { NewControllerOptions } from "./types";
import { NewControllerOptionsStrategy } from "./new-controller.options-strategy";
import { NewControllerInteractiveStrategy } from "./new-controller.interactive-strategy";
import { Config } from "../../../../core";

export const newController = async (
  options: NewControllerOptions,
  config: Config,
  cliPluginPackageName: string
) => {
  if (Object.keys(options).includes("name")) {
    new NewControllerOptionsStrategy(config).apply(
      options,
      cliPluginPackageName
    );
  } else {
    new NewControllerInteractiveStrategy(config).apply(cliPluginPackageName);
  }
};
