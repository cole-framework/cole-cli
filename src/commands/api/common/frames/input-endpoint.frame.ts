import { Texts } from "../../../../core";
import { Frame } from "../../../../core/storyboard";
import { InteractionPrompts } from "../interactions/interaction-prompts";

type FrameResult = {
  endpoint: string;
};

export type InputEndpointContext = {
  endpoint: string;
};

export class InputEndpointFrame extends Frame<FrameResult> {
  public static NAME = "input_endpoint";

  constructor(protected texts: Texts) {
    super(InputEndpointFrame.NAME);
  }

  public async run(context: InputEndpointContext) {
    const { texts } = this;

    if (context.endpoint) {
      return { endpoint: context.endpoint };
    }

    const endpoint = await InteractionPrompts.input<string>(
      texts.get("INPUT_ENDPOINT"),
      context.endpoint
    );

    return { endpoint };
  }
}
