import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import * as moment from 'moment';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  constructor(private datePipe: DatePipe){}

  transform(value: Timestamp | undefined): string {
    return moment(this.datePipe.transform(value?.toMillis(), 'short')).calendar();
  }

}
