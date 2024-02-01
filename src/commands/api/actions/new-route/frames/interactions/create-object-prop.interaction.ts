import { PropJson, Texts } from "../../../../../../core";
import { Interaction, InteractionPrompts } from "../../../../common";

export class CreateObjectPropInteraction extends Interaction<PropJson> {
  constructor(private texts: Texts) {
    super();
  }
  public async run(message?: string): Promise<PropJson> {
    const { texts } = this;
    return InteractionPrompts.form<PropJson>(
      message || texts.get("form_prop"),
      [
        {
          name: "name",
          message: texts.get("name"),
        },
        {
          name: "type",
          message: texts.get("type"),
          initial: "string",
        },
        {
          name: "value",
          message: texts.get("default_value"),
        },
        {
          name: "access",
          message: "access",
          initial: "public",
        },
      ]
    );
  }
}
