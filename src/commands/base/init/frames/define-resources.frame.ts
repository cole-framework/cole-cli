import { Frame, Texts } from "../../../../core";
import { InteractionPrompts } from "../../../api";
import { ProjectDescription } from "../../new-project";

export class DefineResourcesFrame extends Frame<ProjectDescription> {
  public static NAME = "define_resources_frame";

  constructor(protected texts: Texts) {
    super(DefineResourcesFrame.NAME);
  }

  public async run() {
    const { texts } = this;
    const languages = [
      {
        message: texts.get("typescript"),
        name: "typescript",
      },
    ];
    const databases = [
      {
        message: texts.get("cache"),
        name: "cache",
      },
      {
        message: texts.get("mongo"),
        name: "mongo",
      },
      {
        message: texts.get("redis"),
        name: "redis",
      },
    ];

    let source: string;
    let language: string;
    let database: string[];

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

    do {
      database = await InteractionPrompts.multiSelect(
        texts.get("please_select_databases"),
        databases,
        ["cache"],
        texts.get("hint___please_select_databases")
      );
    } while (database.length === 0);

    return {
      source,
      language,
      database,
    };
  }
}
