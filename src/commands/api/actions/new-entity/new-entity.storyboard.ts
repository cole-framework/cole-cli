import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  Texts,
  TimelineFrame,
} from "../../../../core";
import { ApiConfig } from "../../common/api.config";
import { ApiJson } from "../../common/api.types";
import { CreateEntityFrame } from "./frames";

export class NewEntityStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateEntityFrame.NAME) {
        return frame.output;
      }
    }

    return {
      models: [],
      entities: [],
    };
  }
}

export class NewEntityStoryboard extends Storyboard<ApiJson> {
  constructor(
    texts: Texts,
    config: Config,
    apiConfig: ApiConfig,
    session?: StoryboardSession
  ) {
    super(
      "new_entity_storyboard",
      session || new StoryboardSession("new_entity_storyboard"),
      new NewEntityStoryResolver()
    );

    this.addFrame(new CreateEntityFrame(config, apiConfig, texts));
  }
}
