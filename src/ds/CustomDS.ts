export class Queue<T> {
  private _storage: T[] = [];

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

export class Stack<T> {
  private _storage: T[] = [];

  push(value: T) {
    this._storage.push(value);
  }

  pop(): T | undefined {
    return this._storage.pop();
  }

  empty(): boolean {
    return this._storage.length === 0;
  }
}