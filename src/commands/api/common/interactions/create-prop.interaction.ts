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
