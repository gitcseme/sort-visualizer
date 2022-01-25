import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphAlgoService } from '../graph-algo.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {
  @ViewChild('g_containerRef') containerRef?: ElementRef;
  container: HTMLCollection | undefined;
  rows: number = 20;
  cols: number = 34;

  grid: Node[][] = [];
  nodes: string[] = [];

  constructor(private graphAlgoService: GraphAlgoService) { }
  ngAfterViewInit(): void {
    this.container = (this.containerRef?.nativeElement as HTMLDivElement).children;
    console.log('div-collections: ', this.container.length);
  }

  ngOnInit(): void {
    this.initGraph();
  }

  async search() {
    this.graphAlgoService.visiteNode.subscribe((event: {node: Node, colorClass: string}) => {
      this.markVisited(event.node, event.colorClass);
    });

    this.graphAlgoService.tracePathEvent.subscribe((node: Node) => {
      this.markVisited(node, 'path-print');
    })

    if (this.sourceNode !== undefined && this.destNode !== undefined) {
      console.log('started');
      let destination = await this.graphAlgoService.bfs(this.sourceNode, this.destNode, this.grid, this.rows, this.cols);
      console.log('Goal: ', destination);
      if (destination !== undefined) {
        await this.graphAlgoService.tracePath(destination.parent, this.sourceNode);
      }
    }
    else {
      console.log('problems: ', this.sourceNode, this.destNode);
    }

  }

  nodeColorClass: string = '';
  nodeIndicator: number = 0;
  sourceNode: Node | undefined;
  destNode: Node | undefined;

  initSource(): void {
    this.nodeIndicator = 1;
    this.nodeColorClass = 'source-node';
  }
  initDestination(): void {
    this.nodeIndicator = 2;
    this.nodeColorClass = 'dest-node';
  }

  updateNode(node: string): void {
    let [x, y] = node.split('-').map(v => parseInt(v));
    let nodeElement = this.container?.item(x*this.cols + y);
    console.log(nodeElement, this.grid[x][y].visited);

    if (this.nodeIndicator === 1 && this.sourceNode === undefined) {
      this.sourceNode = new Node(x, y);
      nodeElement?.classList.add(this.nodeColorClass);  
    }
    else if (this.nodeIndicator === 2 && this.destNode === undefined) {
      this.destNode = new Node(x, y);
      nodeElement?.classList.add(this.nodeColorClass);
    }
  }

  initGraph() {
    for (let i = 0; i < this.rows; ++i) {
      this.grid[i] = new Array<Node>(this.cols);
      for(let j = 0; j < this.cols; ++j) {
        this.grid[i][j] = new Node(i, j);
        this.nodes.push(`${i}-${j}`);
      }
    }
  }

  markVisited(node: Node, colorClass: string): void {
    // do not chnage souece or destination color
    if ((node.x === this.sourceNode?.x && node.y === this.sourceNode?.y)
      || (node.x === this.destNode?.x && node.y === this.destNode?.y)) {
      return;
    }

    let nodeElement = this.container?.item(node.x*this.cols + node.y);
    if (colorClass === 'path-print') {
      nodeElement?.classList.add(colorClass);
      return;
    }

    if (colorClass === 'internal') {
      nodeElement?.classList.replace('neighbour', colorClass);
    }
    else if (nodeElement?.classList.contains('internal')) {
      nodeElement?.classList.replace('internal', colorClass);
    }
    else {
      nodeElement?.classList.add(colorClass);
    }
  }
}

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
