import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  Texts,
  TimelineFrame,
} from "../../../../core";
import { ApiConfig } from "../../common";
import { ApiJson } from "../../common/api.types";
import { CreateModelsFrame } from "./frames";
import { SelectModelTypesFrame } from "./frames/select-model-types.frame";

export class NewModelStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateModelsFrame.NAME) {
        return frame.output;
      }
    }

    return {
      models: [],
    };
  }
}

export class NewModelStoryboard extends Storyboard<ApiJson> {
  constructor(
    texts: Texts,
    config: Config,
    apiConfig: ApiConfig,
    session?: StoryboardSession
  ) {
    super(
      "new_model_storyboard",
      session || new StoryboardSession("new_model_storyboard"),
      new NewModelStoryResolver()
    );

    this.addFrame(new SelectModelTypesFrame(config, texts)).addFrame(
      new CreateModelsFrame(config, apiConfig, texts),
      (t) => ({ types: t.prevFrame.output })
    );
  }
}
