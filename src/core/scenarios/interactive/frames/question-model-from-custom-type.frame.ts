import LANG from "../../../../defaults/lang.json";
import { InteractionPrompts } from "../interactions/interaction-prompts";
import { Frame } from "../storyboard";

export class QuestionCreateModelFromTypeFrame extends Frame<boolean> {
  public static NAME = "question_create_model";

  constructor(protected texts: typeof LANG) {
    super(QuestionCreateModelFromTypeFrame.NAME);
  }

  public async run() {
    const { texts } = this;
    return InteractionPrompts.confirm(texts.QUESTION_MODEL_FROM_CUSTOM_TYPE);
  }
}
