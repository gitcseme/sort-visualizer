import { EventEmitter, Injectable, Output } from '@angular/core';
import { MetaData } from '../shared/MetaData';

@Injectable({
  providedIn: 'root'
})
export class SortAlgoService {
  @Output() metadataChnaged = new EventEmitter<MetaData>();
  @Output() workingSubArray = new EventEmitter<{left:number, right: number}>();
  operationDelay: number = 100;

  constructor() { }

  // Bubble Sort
  async bubbleSort(data: number[]) {
    let arrayLength: number = data.length;
    for (let i = 0; i < arrayLength; ++i) {
      for (let j = 1; j < arrayLength-i; ++j) {
        if (data[j] < data[j-1]) {
          this.metadataChnaged.emit({ index1: j-1, index2: j, action: 'add' });
          await this.delayExecution(this.operationDelay);
          await this.swap(data, j-1, j);
          await this.delayExecution(this.operationDelay);
          this.metadataChnaged.emit({ index1: j-1, index2: j, action: 'remove' });
        }
      }
    }
  }


  //////////[[[[/////////////((( MERGE SORT )))//////////////]]]]]/////////

  async mergeSort(data: number[], i: number, j: number) { 
    if (i >= j) {
      return;
    }
    let mid = Math.floor(i + (j-i)/2);
    await this.mergeSort(data, i, mid);
    await this.mergeSort(data, mid+1, j);
    await this.merge(data, i, mid, j);
  }

  private async merge(data: number[], i: number, mid: number, j: number) { 
    this.workingSubArray.emit({left: i, right: j});

    let n1: number = mid - i + 1;
    let n2: number = j - mid;

    let a: number[] = new Array(n1);
    let b: number[] = new Array(n2);
    for (let k = 0; k < n1; ++k) a[k] = data[i+k];
    for (let k = 0; k < n2; ++k) b[k] = data[mid+1+k];

    let L = 0, R = 0, k = i;
    while (L < n1 && R < n2) {
      if (a[L] <= b[R]) {
        data[k++] = a[L++];
      }
      else {
        data[k++] = b[R++];
      }
      await this.delayExecution(this.operationDelay);
    }

    while (L < n1) data[k++] = a[L++];
    while (R < n2) data[k++] = b[R++];
  }


  //// Helper Methods //// 
  private delayExecution(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(1), ms));
  }

  private async swap(data: number[], a: number, b: number): Promise<void> {
    let temp = data[a];
    data[a] = data[b];
    data[b] = temp;
  }
}

