import { Pipe, PipeTransform } from '@angular/core';
import { Job } from '../interface/enums/job.enum';

@Pipe({
    name: 'work',
})
export class WorkPipe implements PipeTransform {
    transform(value: Job | undefined): string {
        return this._getJob(value);
    }

    private _getJob(job: Job | undefined): string {
        if (!job) return '';
        const jobs: { [key in Job]: string } = {
            [Job.Agriculture]: 'Agricultura',
            [Job.Builder]: 'Construção',
            [Job.None]: 'Nenhuma',
            [Job.Kitchen]: 'Cozinha',
            [Job.Clean]: 'Limpar',
            [Job.Cut]: 'Cortar',
            [Job.Mining]: 'Mineração',
            [Job.Hunt]: 'Caçar',
        };
        return jobs[job];
    }
}
