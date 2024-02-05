import { Frame, Texts } from "../../../../core";
import { InteractionPrompts } from "../../../api";
import { ProjectDescription } from "../types";

export class DefineProjectFrame extends Frame<ProjectDescription> {
  public static NAME = "define_project_frame";

  constructor(protected texts: Texts) {
    super(DefineProjectFrame.NAME);
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

    let name = "";
    let language = "";
    let database = [];

    while (name.length === 0) {
      name = await InteractionPrompts.input(
        texts.get("please_provide_project_name")
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

    let description;

    do {
      description = await InteractionPrompts.form(
        texts.get("project_form_title"),
        [
          {
            name: "source",
            message: texts.get("source_path"),
            initial: "src",
            hint: texts.get("hint___source_path"),
          },
          {
            name: "author",
            message: texts.get("author"),
          },
          {
            name: "description",
            message: texts.get("description"),
          },
          {
            name: "license",
            message: texts.get("license"),
            initial: "MIT",
          },
        ]
      );
    } while (!description.source);

    return {
      name,
      language,
      database,
      ...description,
    };
  }
}
