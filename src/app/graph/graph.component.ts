import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @ViewChild('g_containerRef') containerRef?: ElementRef;
  rows: number = 20;
  cols: number = 34;

  grid: number[] = [];
  nodes: string[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < this.rows; ++i) {
      for(let j = 0; j < this.cols; ++j) {
        this.grid.push(i+j);
        this.nodes.push(`${i}-${j}`);
      }
    }
  }

  nodeSelected(node: string): void {
    let container = (this.containerRef?.nativeElement as HTMLDivElement).children;
    let [x, y] = node.split('-').map(v => parseInt(v));
    let nodeElement = container.item(x*this.cols + y);
    console.log(nodeElement);
    nodeElement?.classList.add('selectedNode');
  }
}
