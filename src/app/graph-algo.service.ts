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

  // algorithm specific
  dx: number[] = [-1, 0, 1,  0];
  dy: number[] = [ 0, 1, 0, -1];
  rows: number = 0;
  cols: number = 0;

  constructor() { }

  async bfs(source: Node, dest: Node, grid: Node[][], rows: number, cols: number): Promise<Node | undefined> 
  {
    this.rows = rows;
    this.cols = cols;
    let q = new Queue<Node>();
    source.visited = true;
    q.push(source);
    await this.delayExecution(this.operationDelay);
    
    while(!q.empty()) {
      let u = q.pop()!;
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
          q.push(grid[r][c]);
          
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
      return true;
    }
    return false;
  }
}


