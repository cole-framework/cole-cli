import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  Texts,
  TimelineFrame,
} from "../../../../../core";

export type NewControllerResult = {};

export class NewControllerStoryResolver extends StoryResolver<NewControllerResult> {
  resolve(timeline: TimelineFrame[]): NewControllerResult {
    const result: NewControllerResult = {
      entity: null,
      models: [],
      mappers: [],
    };

    return result;
  }
}

export class NewControllerStoryboard extends Storyboard<any> {
  constructor(texts: Texts, config: Config, session?: StoryboardSession) {
    super(
      "new_controller_storyboard",
      session || new StoryboardSession("new_controller_storyboard"),
      new NewControllerStoryResolver()
    );
    //
  }
}
