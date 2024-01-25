import { Config, Frame, Texts } from "../../../../../core";
import { InteractionPrompts } from "../../../common";

export class SelectSourceStoragesFrame extends Frame<string[]> {
  public static NAME = "select_source_storages_frame";
  constructor(
    protected config: Config,
    protected texts: Texts
  ) {
    super(SelectSourceStoragesFrame.NAME);
  }

  public async run() {
    const { texts, config } = this;
    const choices: {}[] = [];
    let list: string[];

    config.databases.forEach((db) => {
      choices.push({
        message: db.name,
        name: db.alias,
        value: true,
      });
    });

    do {
      list = await InteractionPrompts.multiSelect<string[]>(
        texts.get("please_select_source_storages"),
        choices,
        ["cache"],
        texts.get("hint___please_select_source_storages")
      );
    } while (list.length === 0);

    return list;
  }
}
