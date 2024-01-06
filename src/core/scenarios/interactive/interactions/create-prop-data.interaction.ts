import { PropJson } from "../../../components";
import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

export class CreatePropInteraction extends Interaction<PropJson> {
  constructor(texts: any) {
    super(texts);
  }
  public async run(message?: string): Promise<PropJson> {
    const { texts } = this;
    return InteractionPrompts.form<PropJson>(message || texts.FORM_PROP, [
      {
        name: "name",
        message: texts.NAME,
      },
      {
        name: "type",
        message: texts.TYPE,
        initial: "string",
      },
      {
        name: "default",
        message: texts.DEFAULT_VALUE,
      },
    ]);
  }
}
