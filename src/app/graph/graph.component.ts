import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @ViewChild('g_containerRef') containerRef?: ElementRef;
  dymension: number = 11;
  row: number = 0;
  grid: number[] = [];
  nodes: string[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < this.dymension; ++i) {
      for(let j = 0; j < this.dymension; ++j) {
        this.grid.push(i+j);
        this.nodes.push(`${i}-${j}`);
      }
    }
  }

  nodeSelected(node: string): void {
    let container = (this.containerRef?.nativeElement as HTMLDivElement).children;
    let [x, y] = node.split('-').map(v => parseInt(v));
    let nodeElement = container.item(x*this.dymension + y);
    nodeElement?.classList.add('selectedNode');
  }
}
