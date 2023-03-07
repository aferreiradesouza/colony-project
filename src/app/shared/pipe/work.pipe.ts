import { Pipe, PipeTransform } from '@angular/core';
import { Job } from '../model/settler/work.model';

@Pipe({
    name: 'work',
})
export class WorkPipe implements PipeTransform {
    transform(value: Job): string {
        return this._getJob(value);
    }

    private _getJob(job: Job): string {
        const jobs: { [key in Job]: string } = {
            [Job.Agriculture]: 'Agricultura',
            [Job.Construction]: 'Construção',
            [Job.None]: 'Nenhuma',
            [Job.Kitchen]: 'Cozinha',
            [Job.Clean]: 'Limpar',
        };
        return jobs[job];
    }
}
