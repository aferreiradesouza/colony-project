import { Pipe, PipeTransform } from '@angular/core';
import { ProcessTask } from '../interface/enums/process-task.enum';

@Pipe({
    name: 'taskProcess',
})
export class TaskProcessPipe implements PipeTransform {
    transform(value: ProcessTask): string {
        return this._getTaskProcess(value);
    }

    private _getTaskProcess(processTask: ProcessTask): string {
        const process: { [key in ProcessTask]: string } = {
            [ProcessTask.Ir]: 'Indo',
            [ProcessTask.None]: 'Nada',
            [ProcessTask.Produzir]: 'Produzindo',
            [ProcessTask.TransportarDoDeposito]:
                'Transportando para a estrutura',
            [ProcessTask.TransportarParaDeposito]:
                'Transportando para o depósito',
        };
        return process[processTask];
    }
}
