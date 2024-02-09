import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  Texts,
  TimelineFrame,
} from "../../../../core";
import { ProjectConfig } from "../../common";
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
    projectConfig: ProjectConfig,
    session?: StoryboardSession
  ) {
    super(
      "new_model_storyboard",
      session || new StoryboardSession("new_model_storyboard"),
      new NewModelStoryResolver()
    );

    this.addFrame(new SelectModelTypesFrame(config, texts)).addFrame(
      new CreateModelsFrame(config, projectConfig, texts),
      (t) => ({ types: t.prevFrame.output })
    );
  }
}
