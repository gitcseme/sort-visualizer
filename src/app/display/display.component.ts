import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SortAlgoService, MetaData } from '../sort-algo.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, AfterViewInit {
  @ViewChild('d_containerRef') containerRef?: ElementRef;
  container: HTMLCollection | undefined;

  data: number[] = [];
  showValue: boolean = true;
  operationDelay: number = 100;
  algorithms: string[] = ['bubble sort', 'merge sort'];
  selectedAlgorithm: string = this.algorithms[0];
  msTime: number[] = [10, 20, 50, 100, 500, 1000];

  constructor(private sortAlgoService: SortAlgoService) {}
  ngAfterViewInit(): void {
    this.container = (this.containerRef?.nativeElement as HTMLDivElement).children;
  }

  ngOnInit(): void {
    this.randomizeData();
  }

  async applySort() {
    this.sortAlgoService.metadataChnaged.subscribe((mdata: MetaData) => {
      this.changeColor(mdata.index1, mdata.index2, mdata.action);
    });

    if (this.selectedAlgorithm == 'bubble sort') {
      await this.sortAlgoService.bubbleSort(this.data);
    }
    else {
      await this.sortAlgoService.mergeSort(this.data, 0, this.data.length - 1);
    }
  }

  // Utility functions.

  changeColor(index1: number, index2: number, action: string) {
    if (action == 'add') {
      this.container?.item(index1)?.classList.add('workingNode');
      this.container?.item(index2)?.classList.add('workingNode');
      console.log('add: ', index1, index2);
    }
    else {
      this.container?.item(index1)?.classList.remove('workingNode');
      this.container?.item(index2)?.classList.remove('workingNode');
    }
  }

  setOperationDelay() {
    this.sortAlgoService.operationDelay = this.operationDelay;
  }

  randomizeData(): void {
    this.data = [];
    for (let i = 0; i < 50; ++i) {
      let num = this.getRandomInt(1, 75);
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
