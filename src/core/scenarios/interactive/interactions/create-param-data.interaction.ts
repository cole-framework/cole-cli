import { ParamJson } from "../../../components";
import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

export class CreateParamInteraction extends Interaction<ParamJson> {
  constructor(texts: any) {
    super(texts);
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
        options?.message || texts.FORM_PARAM,
        [
          {
            name: "name",
            message: texts.NAME,
            initial: options?.initialName,
          },
          {
            name: "type",
            message: texts.TYPE,
            initial: options?.initialType || "string",
          },
          {
            name: "default",
            message: texts.DEFAULT_VALUE,
            initial: options?.initialValue,
          },
        ]
      );
    } while (!param.type && !param.name);

    return param;
  }
}
