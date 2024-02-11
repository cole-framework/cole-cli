import { ParamJson, Texts } from "@cole-framework/cole-cli-core";
import { Interaction } from "../../../../core";
import { InteractionPrompts } from "../../../../core";

export class CreateParamInteraction extends Interaction<ParamJson> {
  constructor(private texts: Texts) {
    super();
  }
  public async run(message?: string): Promise<ParamJson> {
    const { texts } = this;
    return InteractionPrompts.form<ParamJson>(
      message || texts.get("form_param"),
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
      ]
    );
  }
}
