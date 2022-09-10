
export class Node {
  x: number;
  y: number;
  visited: boolean;
  parent: Node;
  
  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
    this.visited = false;
    this.parent = this;
  }
}
