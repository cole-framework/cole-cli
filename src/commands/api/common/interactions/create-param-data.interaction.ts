import { Texts } from "../../../../core";
import { ParamJson } from "../../../../core/components";
import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

export class CreateParamInteraction extends Interaction<ParamJson> {
  constructor(private texts: Texts) {
    super();
  }
  public async run(options?: {
    message?: string;
    initialName?: string;
    initialType?: string;
    initialValue?: string;
  }): Promise<ParamJson> {
    const { texts } = this;
    let param: ParamJson;

    do {
      param = await InteractionPrompts.form<ParamJson>(
        options?.message || texts.get("FORM_PARAM"),
        [
          {
            name: "name",
            message: texts.get("NAME"),
            initial: options?.initialName,
          },
          {
            name: "type",
            message: texts.get("TYPE"),
            initial: options?.initialType || "string",
          },
          {
            name: "default",
            message: texts.get("DEFAULT_VALUE"),
            initial: options?.initialValue,
          },
        ]
      );
    } while (!param.type && !param.name);

    return param;
  }
}
