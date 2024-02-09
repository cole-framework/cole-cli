import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  TimelineFrame,
} from "../../../../core";
import { ApiJson } from "../../common/api.types";
import { CreateEntityFrame } from "./frames";
import { Texts } from "@cole-framework/cole-cli-core";

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
  constructor(texts: Texts, config: Config, session?: StoryboardSession) {
    super(
      "new_entity_storyboard",
      session || new StoryboardSession("new_entity_storyboard"),
      new NewEntityStoryResolver()
    );

    this.addFrame(new CreateEntityFrame(config, texts));
  }
}
