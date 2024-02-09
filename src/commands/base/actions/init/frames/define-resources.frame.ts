import { PluginMap, ProjectDescription, Texts } from "@cole-framework/cole-cli-core";
import { Frame } from "../../../../../core";
import { InteractionPrompts } from "../../../../api";

export class DefineResourcesFrame extends Frame<ProjectDescription> {
  public static NAME = "define_resources_frame";

  constructor(
    protected pluginMap: PluginMap,
    protected texts: Texts
  ) {
    super(DefineResourcesFrame.NAME);
  }

  public async run() {
    const { texts, pluginMap } = this;
    const languages = pluginMap.languages.reduce((acc, c) => {
      acc.push({
        message: texts.get(c.alias),
        name: c.alias,
      });
      return acc;
    }, []);

    let source = "";
    let language = "";
    let framework = "";
    let service = "";
    let database = [];

    while (source.length === 0) {
      source = await InteractionPrompts.input(
        texts.get("please_provide_project_source_path"),
        "",
        texts.get("hint___please_provide_project_source_path")
      );
    }

    do {
      language = await InteractionPrompts.select(
        texts.get("please_select_language"),
        languages,
        ["typescript"]
      );
    } while (language.length === 0);

    const databases = pluginMap.databases.reduce(
      (acc, c) => {
        if (c.packages[language]) {
          acc.push({
            message: texts.get(c.alias),
            name: c.alias,
          });
        }
        return acc;
      },
      [
        {
          message: texts.get("cache"),
          name: "cache",
        },
      ]
    );

    do {
      database = await InteractionPrompts.multiSelect(
        texts.get("please_select_databases"),
        databases,
        ["cache"],
        texts.get("hint___please_select_databases")
      );
    } while (database.length === 0);

    const frameworks = pluginMap.web_frameworks.reduce(
      (acc, c) => {
        if (c.packages[language]) {
          acc.push({
            message: texts.get(c.alias),
            name: c.alias,
          });
        }
        return acc;
      },
      [
        {
          message: texts.get("none"),
          name: "none",
        },
      ]
    );

    do {
      framework = await InteractionPrompts.select(
        texts.get("please_select_framework"),
        frameworks,
        ["none"]
      );
    } while (framework.length === 0);

    const services = pluginMap.services.reduce(
      (acc, c) => {
        if (c.packages[language]) {
          acc.push({
            message: texts.get(c.alias),
            name: c.alias,
          });
        }
        return acc;
      },
      [
        {
          message: texts.get("none"),
          name: "none",
        },
      ]
    );

    do {
      service = await InteractionPrompts.select(
        texts.get("please_select_service"),
        services,
        ["none"]
      );
    } while (service.length === 0);

    const result = {
      source,
      language,
      database,
    };

    if (framework !== "none") {
      result["framework"] = framework;
    }

    if (service !== "none") {
      result["service"] = service;
    }

    return result;
  }
}
