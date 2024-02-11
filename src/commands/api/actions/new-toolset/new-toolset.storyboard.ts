import { Texts } from "@cole-framework/cole-cli-core";
import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  TimelineFrame,
} from "../../../../core";
import { ApiJson } from "../../common/api.types";
import { CreateToolsetFrame, SelectToolsetlayerFrame } from "./frames";

export class NewToolsetStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateToolsetFrame.NAME) {
        return frame.output;
      }
    }

    return {
      models: [],
      entities: [],
      toolsets: [],
    };
  }
}

export class NewToolsetStoryboard extends Storyboard<ApiJson> {
  constructor(texts: Texts, config: Config, session?: StoryboardSession) {
    super(
      "new_toolset_storyboard",
      session || new StoryboardSession("new_toolset_storyboard"),
      new NewToolsetStoryResolver()
    );

    this.addFrame(new SelectToolsetlayerFrame(config, texts)).addFrame(
      new CreateToolsetFrame(config, texts),
      (t) => ({ layer: t.prevFrame.output })
    );
  }
}
