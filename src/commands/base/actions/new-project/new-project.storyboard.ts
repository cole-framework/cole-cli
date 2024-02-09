import { PluginMap, ProjectDescription, Texts } from "@cole-framework/cole-cli-core";
import {
  StoryResolver,
  Storyboard,
  StoryboardSession,
  TimelineFrame,
} from "../../../../core";
import { DefineProjectFrame } from "./frames";

export class NewProjectResolver extends StoryResolver<ProjectDescription> {
  resolve(timeline: TimelineFrame[]): ProjectDescription {
    for (const frame of timeline) {
      if (frame.name === DefineProjectFrame.NAME) {
        return frame.output;
      }
    }

    return null;
  }
}

export class NewProjectStoryboard extends Storyboard<ProjectDescription> {
  constructor(texts: Texts, pluginMap: PluginMap, session?: StoryboardSession) {
    super(
      "new_controller_storyboard",
      session || new StoryboardSession("new_controller_storyboard"),
      new NewProjectResolver()
    );

    this.addFrame(new DefineProjectFrame(pluginMap, texts));
  }
}
