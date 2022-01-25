export default class Queue<T> {
  _storage: T[] = [];

  push(value: T): void {
    this._storage.push(value);
  }

  pop(): T | undefined {
    return this._storage.shift();
  }

  empty() {
    return this._storage.length === 0;
  }
}