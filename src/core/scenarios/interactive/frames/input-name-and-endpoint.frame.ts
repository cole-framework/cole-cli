import { Frame } from "../storyboard";
import LANG from "../../../../defaults/lang.json";
import { InputNameAndEndpointInteraction } from "../interactions";

type FrameResult = {
  name: string;
  endpoint: string;
};

export type InputNameAndEndpointContext = {
  name?: string;
  endpoint?: string;
  isEndpointRequired?: boolean;
};

export class InputNameAndEndpointFrame extends Frame<
  FrameResult,
  InputNameAndEndpointContext
> {
  public static NAME = "input_name_endpoint_frame";

  constructor(
    protected texts: typeof LANG,
    protected inputNameMessage = texts.INPUT_MODEL_NAME,
    protected inputNameHint?: string
  ) {
    super(InputNameAndEndpointFrame.NAME);
  }

  public async run(context: InputNameAndEndpointContext) {
    const { texts, inputNameMessage, inputNameHint } = this;
    return new InputNameAndEndpointInteraction(
      texts,
      inputNameMessage,
      inputNameHint
    ).run(context);
  }
}
