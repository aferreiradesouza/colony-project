import { Pipe, PipeTransform } from '@angular/core';
import { Tasks } from '../interface/enums/tasks.enum';
import { TaskDatabase } from '../database/task.database';

@Pipe({
  name: 'task'
})
export class TaskPipe implements PipeTransform {

  transform(value: Tasks): string {
    return TaskDatabase.getTaskById(value).name;
  }

}
