import { config } from "process";
import {
  StoryResolver,
  Storyboard,
  StoryboardSession,
  TimelineFrame,
} from "../../../../core";
import { DefineResourcesFrame } from "./frames";
import { PluginMap, ProjectDescription, Texts } from "@cole-framework/cole-cli-core";

export class InitResolver extends StoryResolver<ProjectDescription> {
  resolve(timeline: TimelineFrame[]): ProjectDescription {
    for (const frame of timeline) {
      if (frame.name === DefineResourcesFrame.NAME) {
        return frame.output;
      }
    }

    return null;
  }
}

export class InitStoryboard extends Storyboard<ProjectDescription> {
  constructor(texts: Texts, pluginMap: PluginMap, session?: StoryboardSession) {
    super(
      "new_controller_storyboard",
      session || new StoryboardSession("new_controller_storyboard"),
      new InitResolver()
    );

    this.addFrame(new DefineResourcesFrame(pluginMap, texts));
  }
}
