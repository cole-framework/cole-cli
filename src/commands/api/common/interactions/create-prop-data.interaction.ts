import { Texts } from "../../../../core";
import { PropJson } from "../../../../core/components";
import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

export class CreatePropInteraction extends Interaction<PropJson> {
  constructor(private texts: Texts) {
    super();
  }
  public async run(message?: string): Promise<PropJson> {
    const { texts } = this;
    return InteractionPrompts.form<PropJson>(
      message || texts.get("FORM_PROP"),
      [
        {
          name: "name",
          message: texts.get("NAME"),
        },
        {
          name: "type",
          message: texts.get("TYPE"),
          initial: "string",
        },
        {
          name: "value",
          message: texts.get("DEFAULT_VALUE"),
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
