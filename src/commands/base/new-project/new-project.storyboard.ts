import { config } from "process";
import {
  StoryResolver,
  Storyboard,
  StoryboardSession,
  Texts,
  TimelineFrame,
} from "../../../core";
import { DefineProjectFrame } from "./frames";
import { ProjectDescription } from "./types";

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
  constructor(texts: Texts, session?: StoryboardSession) {
    super(
      "new_controller_storyboard",
      session || new StoryboardSession("new_controller_storyboard"),
      new NewProjectResolver()
    );

    this.addFrame(new DefineProjectFrame(texts));
  }
}
