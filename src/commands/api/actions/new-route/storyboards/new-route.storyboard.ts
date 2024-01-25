import { Config, ModelType, Texts } from "../../../../../core";
import { StoryResolver, Storyboard } from "../../../../../core/storyboard";
import {
  StoryboardSession,
  TimelineFrame,
} from "../../../../../core/storyboard-session";

export type NewRouteResult = {};

export class NewRouteStoryResolver extends StoryResolver<NewRouteResult> {
  resolve(timeline: TimelineFrame[]): NewRouteResult {
    const result: NewRouteResult = { entity: null, models: [], mappers: [] };

    return result;
  }
}

export class NewRouteStoryboard extends Storyboard<any> {
  constructor(texts: Texts, config: Config, session?: StoryboardSession) {
    super(
      "new_route_storyboard",
      session || new StoryboardSession("new_route_storyboard"),
      new NewRouteStoryResolver()
    );
    //
  }
}
