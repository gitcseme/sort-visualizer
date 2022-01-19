import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SortAlgoService, MetaData } from '../sort-algo.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  @ViewChild('d_containerRef') containerRef?: ElementRef;
  
  data: number[] = [];
  showValue: boolean = true;
  algorithms: string[] = ['bubble sort', 'merge sort'];
  selectedAlgorithm: string = this.algorithms[0];
  msTime: number[] = [10, 20, 50, 100, 500, 1000];
  operationDelay: number = 100;

  constructor(private sortAlgoService: SortAlgoService) {}

  ngOnInit(): void {
    this.randomizeData();
  }

  async applySort() {
    if (this.selectedAlgorithm == 'bubble sort') {
      this.sortAlgoService.bubbleSort(this.data);
    }
    else {
      this.sortAlgoService.mergeSort(this.data, 0, this.data.length - 1);
    }

    this.sortAlgoService.metadataChnaged.subscribe((mdata: MetaData) => {
      this.changeColor(mdata.index1, mdata.index2, mdata.action);
    })
  }

  changeColor(index1: number, index2: number, action: string) {
    let nodes = (this.containerRef?.nativeElement as HTMLDivElement).children;
    if (action == 'add') {
      nodes.item(index1)?.classList.add('workingNode');
      nodes.item(index2)?.classList.add('workingNode');
    }
    else {
      nodes.item(index1)?.classList.remove('workingNode');
      nodes.item(index2)?.classList.remove('workingNode');
    }
  }

  setOperationDelay() {
    this.sortAlgoService.operationDelay = this.operationDelay;
  }

  randomizeData(): void {
    this.data = [];
    for (let i = 0; i < 50; ++i) {
      let num = this.getRandomInt(1, 500);
      this.data.push(num);
    }
  }

  onOperationDelayChange() {
    this.sortAlgoService.operationDelay = this.operationDelay;
  }

  getRandomInt(low: number, high: number) : number{
    low = Math.ceil(low);
    high = Math.floor(high);
    return Math.floor(Math.random() * (high - low + 1)) + low; 
  }

}
