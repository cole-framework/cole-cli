import { Texts } from "@cole-framework/cole-cli-core";
import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  TimelineFrame,
} from "../../../../core";
import { ApiJson } from "../../common/api.types";
import { CreateUseCaseFrame } from "./frames";

export class NewUseCaseStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateUseCaseFrame.NAME) {
        return frame.output;
      }
    }

    return {
      models: [],
      entities: [],
      use_cases: [],
    };
  }
}

export class NewUseCaseStoryboard extends Storyboard<ApiJson> {
  constructor(texts: Texts, config: Config, session?: StoryboardSession) {
    super(
      "new_use_case_storyboard",
      session || new StoryboardSession("new_use_case_storyboard"),
      new NewUseCaseStoryResolver()
    );

    this.addFrame(new CreateUseCaseFrame(config, texts));
  }
}
