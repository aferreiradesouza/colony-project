import { Pipe, PipeTransform } from '@angular/core';
import { SettlersBusiness } from '../business/settlers.business';

@Pipe({
    name: 'settler',
})
export class SettlerPipe implements PipeTransform {
    constructor(private settlersBusiness: SettlersBusiness) {}

    transform(value: string | null): string {
        return value
            ? this.settlersBusiness.getSettlerById(value)?.completeName ?? '-'
            : '-';
    }
}
