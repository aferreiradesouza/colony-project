import { Pipe, PipeTransform } from '@angular/core';
import { Process } from '../interface/enums/process.enum';

@Pipe({
    name: 'process',
})
export class TaskProcessPipe implements PipeTransform {
    transform(value: Process | undefined): string {
        if (!value) return '';
        return this.getProcess(value);
    }

    private getProcess(processTask: Process): string {
        const process: { [key in Process]: string } = {
            [Process.Ir]: 'Indo',
            [Process.None]: 'Nada',
            [Process.Produzir]: 'Produzindo',
            [Process.TransportarDoDeposito]:
                'Transportando para a estrutura',
            [Process.TransportarParaDeposito]:
                'Transportando para o depósito',
            [Process.Construir]: 'Construindo',
        };
        return process[processTask];
    }
}
