import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import "moment-timezone";

/**
 * Generated class for the MomentPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  
  transform(date, format) {
    date = moment(date);
    return moment(date.add(moment.duration(5, 'hours'))).tz('America/Bogota').format(format);
  }
}
