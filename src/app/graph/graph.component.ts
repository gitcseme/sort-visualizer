import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphAlgoService } from '../graph-algo.service';
import { distinctUntilChanged, fromEvent, Observable, Subscription, switchMap, takeUntil, throttleTime } from 'rxjs';
import { Router } from '@angular/router';

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
  showGridValue: boolean = true;
  operationDelay: number = 50;
  msTime: number[] = [20, 50, 100, 200, 500];

  algorithms: string[] = ['BFS', 'DFS'];
  selectedAlgorithm: string = this.algorithms[0];

  grid: Node[][] = [];
  nodes: string[] = [];

  constructor(private graphAlgoService: GraphAlgoService, private router: Router) { }

  // MOUSE EVENTS
  mousedown: Observable<Event>| undefined;
  mousemove: Observable<Event>| undefined;
  mouseup: Observable<Event>| undefined;
  mouseHold$: Observable<Event>| undefined;
  mouseHoldSubscription: Subscription | undefined;

  ngAfterViewInit(): void {
    this.container = (this.containerRef?.nativeElement as HTMLDivElement).children;
    this.graphAlgoService.loadPrerequisites(this.grid, this.container);
    
    this.mousedown = fromEvent(this.containerRef?.nativeElement, 'mousedown');
    this.mousemove = fromEvent(this.containerRef?.nativeElement, 'mousemove');
    this.mouseup = fromEvent(this.containerRef?.nativeElement, 'mouseup');
    
    this.registerHold();
    this.mouseup.subscribe(event => this.registerHold());    
  }

  registerHold() {
    this.mouseHoldSubscription?.unsubscribe();
    this.mouseHold$ = this.mousedown!
    .pipe(
      switchMap(event => this.mousemove!),
      throttleTime(10),
      distinctUntilChanged((prev, curr) => {
        return (prev.target as HTMLElement).id === (curr.target as HTMLElement).id;
      }),
      takeUntil(this.mouseup!)
    );

    this.mouseHoldSubscription = this.mouseHold$?.subscribe(event => {
      let cord: string = (event.target as HTMLElement).id;
      console.log('event: ', cord);
      if (Boolean(cord)) {
        let [x, y] = cord.split('-').map(num => parseInt(num));
        let nodeElement = this.container?.item(x*this.cols + y);
        if (!nodeElement?.classList.contains('block_path')) {
          nodeElement?.classList.add('block_path');
        }
      }
    });
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
    });

    if (this.sourceNode !== undefined && this.destNode !== undefined) {
      let destination = await this.graphAlgoService.bfs(this.sourceNode, this.destNode);
      if (destination !== undefined) {
        await this.graphAlgoService.tracePath(destination.parent, this.sourceNode);
        this.resetNodes();
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

  // methods triggering form the html
  initSource(): void {
    this.nodeIndicator = 1;
    this.nodeColorClass = 'source-node';
  }
  initDestination(): void {
    this.nodeIndicator = 2;
    this.nodeColorClass = 'dest-node';
  }
  readyToSort(): boolean {
    return !(this.sourceNode !== undefined && this.destNode !== undefined);
  }
  resetNodes(): void {
    this.nodeIndicator = 0;
    this.sourceNode = undefined;
    this.destNode = undefined;
  }
  reload() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['graph']);
    }); 
  }
  onOperationDelayChange() {
    this.graphAlgoService.operationDelay = this.operationDelay;
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

  // Prepare graph
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
