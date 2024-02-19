import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  TimelineFrame,
} from "../../../../core";
import { CommandConfig } from "../../../../core/config/command.config";
import { ApiJson } from "../../common/api.types";
import { CreateMappersFrame, SelectMapperStoragesFrame } from "./frames";
import { Texts } from "@cole-framework/cole-cli-core";

export class NewMapperStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateMappersFrame.NAME) {
        return frame.output;
      }
    }

    return {
      models: [],
      entities: [],
      mappers: [],
    };
  }
}

export class NewMapperStoryboard extends Storyboard<ApiJson> {
  constructor(texts: Texts, config: Config, session?: StoryboardSession) {
    super(
      "new_mapper_storyboard",
      session || new StoryboardSession("new_mapper_storyboard"),
      new NewMapperStoryResolver()
    );

    this.addFrame(new SelectMapperStoragesFrame(config, texts)).addFrame(
      new CreateMappersFrame(config, texts),
      (t) => ({ storages: t.prevFrame.output })
    );
  }
}
