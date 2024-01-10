import { Component, TypeInfo } from "../../../core";

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
