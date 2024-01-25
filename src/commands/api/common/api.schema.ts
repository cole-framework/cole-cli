import { Component, TypeInfo } from "../../../core";
import { ApiObject } from "./api.types";
import { Controller } from "../actions/new-controller";
import { Entity } from "../actions/new-entity";
import { Mapper } from "../actions/new-mapper";
import { Model } from "../actions/new-model";
import {
  Repository,
  RepositoryImpl,
  RepositoryFactory,
} from "../actions/new-repository";
import { Route, RouteIO } from "../actions/new-route";
import { Source } from "../actions/new-source";
import { Toolset } from "../actions/new-toolset";
import { UseCase } from "../actions/new-use-case";

export class ApiSchema {
  public readonly toolsets = new ApiComponentCollection<Toolset>();
  public readonly models = new ApiComponentCollection<Model>();
  public readonly entities = new ApiComponentCollection<Entity>();
  public readonly mappers = new ApiComponentCollection<Mapper>();
  public readonly sources = new ApiComponentCollection<Source>();
  public readonly routes = new ApiComponentCollection<Route>();
  public readonly route_ios = new ApiComponentCollection<RouteIO>();
  public readonly controllers = new ApiComponentCollection<Controller>();
  public readonly use_cases = new ApiComponentCollection<UseCase>();
  public readonly repositories = new ApiComponentCollection<Repository>();
  public readonly repository_impls =
    new ApiComponentCollection<RepositoryImpl>();
  public readonly repository_factories =
    new ApiComponentCollection<RepositoryFactory>();

  toObject(): ApiObject {
    const {
      models,
      entities,
      mappers,
      routes,
      sources,
      toolsets,
      route_ios,
      controllers,
      use_cases,
      repositories,
      repository_impls,
      repository_factories,
    } = this;

    return {
      toolsets: toolsets.toArray().map((i) => i.toObject()),
      controllers: controllers.toArray().map((i) => i.toObject()),
      models: models.toArray().map((i) => i.toObject()),
      entities: entities.toArray().map((i) => i.toObject()),
      mappers: mappers.toArray().map((i) => i.toObject()),
      sources: sources.toArray().map((i) => i.toObject()),
      routes: routes.toArray().map((i) => i.toObject()),
      route_ios: route_ios.toArray().map((i) => i.toObject()),
      use_cases: use_cases.toArray().map((i) => i.toObject()),
      repositories: repositories.toArray().map((i) => i.toObject()),
      repository_impls: repository_impls.toArray().map((i) => i.toObject()),
      repository_factories: repository_factories
        .toArray()
        .map((i) => i.toObject()),
    };
  }
}

export class ApiComponentCollection<T extends Component> {
  private _list: T[] = [];

  add(component: T) {
    if (
      this._list.findIndex(
        (i) =>
          i.element.name === component.element.name &&
          TypeInfo.areIdentical(i.type, component.type)
      ) === -1
    ) {
      this._list.push(component);
    }
  }

  forEach(callbackfn: (value: T, index: number, array: T[]) => void) {
    return this._list.forEach(callbackfn);
  }

  find(callbackfn: (value: T) => boolean): T {
    for (const item of this._list) {
      if (callbackfn(item)) {
        return item;
      }
    }
    return null;
  }

  has(callbackfn: (value: T) => boolean): boolean {
    for (const item of this._list) {
      if (callbackfn(item)) {
        return true;
      }
    }
    return false;
  }

  toArray() {
    return [...this._list];
  }
}
