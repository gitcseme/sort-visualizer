import { EventEmitter, Injectable, Output } from '@angular/core';
import Queue from 'src/ds/CustomDS';

import { Node } from "./graph/graph.component";

@Injectable({
  providedIn: 'root'
})
export class GraphAlgoService {
  // Meta
  operationDelay: number = 50;
  @Output() visiteNode = new EventEmitter<{node: Node, colorClass: string}>();
  @Output() tracePathEvent = new EventEmitter<Node>();
  container: HTMLCollection | undefined;

  // algorithm specific
  dx: number[] = [-1, 0, 1,  0];
  dy: number[] = [ 0, 1, 0, -1];
  rows: number = 0;
  cols: number = 0;

  constructor() { }

  async bfs(source: Node, dest: Node, grid: Node[][]): Promise<Node | undefined> 
  {
    this.rows = grid.length;
    this.cols = grid[0].length;
    let queue = new Queue<Node>();
    source.visited = true;
    queue.push(source);
    await this.delayExecution(this.operationDelay);
    
    while(!queue.empty()) {
      let u = queue.pop()!;
      this.visiteNode.emit({ node: u, colorClass: 'internal'});
      await this.delayExecution(this.operationDelay);

      for (let i = 0; i < 4; ++i) {
        let r = u.x + this.dx[i];
        let c = u.y + this.dy[i];

        if (this.isSafe(r, c) && !grid[r][c].visited) {
          this.visiteNode.emit({ node: grid[r][c], colorClass: 'neighbour'});
          await this.delayExecution(this.operationDelay);
          
          grid[r][c].visited = true;
          grid[r][c].parent = u;    // track parent
          queue.push(grid[r][c]);
          
          if (dest.x == r && dest.y == c) {
            console.log('found dest: ', r, c);
            return grid[r][c];
          }
        }
      }
      
      this.visiteNode.emit({ node: u, colorClass: 'neighbour'});
    }
    return undefined;
  }

  async tracePath(start: Node, end: Node): Promise<void> {
    let current = start;
    while ((current.x !== end.x) || (current.y !== end.y)) {
      this.tracePathEvent.emit(current);
      await this.delayExecution(this.operationDelay);
      current = current.parent;
    }
    console.log('tracing ends!');
  }

  //// Helper Methods //// 
  private delayExecution(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(1),ms));
  }

  private isSafe(r: number, c: number): boolean {
    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
      let node = this.container?.item(r*this.cols + c);
      if (!node?.classList.contains('block_path'))
        return true;
    }
    return false;
  }
}


