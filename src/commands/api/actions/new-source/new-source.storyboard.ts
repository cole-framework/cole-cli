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
import { CreateSourcesFrame, SelectSourceStoragesFrame } from "./frames";

export class NewSourceStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateSourcesFrame.NAME) {
        return frame.output;
      }
    }

    return {
      models: [],
      entities: [],
      sources: [],
    };
  }
}

export class NewSourceStoryboard extends Storyboard<ApiJson> {
  constructor(
    texts: Texts,
    config: Config,
    apiConfig: ApiConfig,
    session?: StoryboardSession
  ) {
    super(
      "new_source_storyboard",
      session || new StoryboardSession("new_source_storyboard"),
      new NewSourceStoryResolver()
    );

    this.addFrame(new SelectSourceStoragesFrame(config, texts)).addFrame(
      new CreateSourcesFrame(config, apiConfig, texts),
      (t) => ({ storages: t.prevFrame.output })
    );
  }
}
