import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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

  grid: number[] = [];
  nodes: string[] = [];

  constructor() { }
  ngAfterViewInit(): void {
    this.container = (this.containerRef?.nativeElement as HTMLDivElement).children;
    console.log('div-collections: ', this.container.length);
  }

  ngOnInit(): void {
    for (let i = 0; i < this.rows; ++i) {
      for(let j = 0; j < this.cols; ++j) {
        this.grid.push(i+j);
        this.nodes.push(`${i}-${j}`);
      }
    }
  }

  nodeIndicator: number = 0;
  nodeColor: string = '';
  sourceNode: Node | undefined;
  destNode: Node | undefined;

  initSource(): void {
    this.nodeIndicator = 1;
    this.nodeColor = 'source-node';
  }
  initDestination(): void {
    this.nodeIndicator = 2;
    this.nodeColor = 'dest-node';
  }

  updateNode(node: string): void {
    let [x, y] = node.split('-').map(v => parseInt(v));
    let nodeElement = this.container?.item(x*this.cols + y);
    console.log(nodeElement);

    if (this.nodeIndicator == 1 && this.sourceNode == undefined) {
      this.sourceNode = new Node(x, y);
      nodeElement?.classList.add(this.nodeColor);  
    }
    else if (this.nodeIndicator == 2 && this.destNode == undefined) {
      this.destNode = new Node(x, y);
      nodeElement?.classList.add(this.nodeColor);
    }
  }

}

export class Node {
  x: number;
  y: number;
  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }
}