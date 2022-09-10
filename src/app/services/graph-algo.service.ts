import { EventEmitter, Injectable, Output } from '@angular/core';
import { Queue, Stack } from 'src/app/shared/CustomDataStructures';

import { Node } from "../shared/node";

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
  source: Node | undefined;
  dest: Node | undefined;
  grid: Node[][] = [];

  loadPrerequisites(grid: Node[][], container: HTMLCollection): void {
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length; 
    this.container = container;
  }

  constructor() { }

  // BFS
  async bfs(source: Node, dest: Node): Promise<Node | undefined> 
  {
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

        if (this.isSafe(r, c) && !this.grid[r][c].visited) {
          this.visiteNode.emit({ node: this.grid[r][c], colorClass: 'neighbour'});
          await this.delayExecution(this.operationDelay);
          
          this.grid[r][c].visited = true;
          this.grid[r][c].parent = u;    // track parent
          queue.push(this.grid[r][c]);
          
          if (dest.x == r && dest.y == c) {
            console.log('found dest: ', r, c);
            return this.grid[r][c];
          }
        }
      }
      
      this.visiteNode.emit({ node: u, colorClass: 'neighbour'});
    }
    return undefined;
  }

  // DFS
  async dfs(source: Node, dest: Node): Promise<Node | undefined>  
  {
    let stack = new Stack<Node>();
    stack.push(source);
    
    while (!stack.empty()) {
      let u = stack.pop()!;
      u.visited = true;
      this.visiteNode.emit({ node: u, colorClass: 'internal'});
      await this.delayExecution(this.operationDelay);

      for (let i = 0; i < 4; ++i) {
        let r = u.x + this.dx[i];
        let c = u.y + this.dy[i];

        if (this.isSafe(r, c) && !this.grid[r][c].visited) {
          this.visiteNode.emit({ node: this.grid[r][c], colorClass: 'neighbour'});
          await this.delayExecution(this.operationDelay);
          
          this.grid[r][c].visited = true;
          this.grid[r][c].parent = u;    // track parent
          stack.push(this.grid[r][c]);

          if (dest.x == r && dest.y == c) {
            console.log('found dest: ', r, c);
            return this.grid[r][c];
          }
        }
      }
      console.log('running...', u.x, u.y);

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


