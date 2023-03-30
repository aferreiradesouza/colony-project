import { Pipe, PipeTransform } from '@angular/core';
import { ItemDatabase } from '../database/item.database';
import { Itens } from '../interface/enums/item.enum';

@Pipe({
    name: 'item',
})
export class ItemPipe implements PipeTransform {
    transform(value: Itens): string {
        return ItemDatabase.getItemById(value).name;
    }
}
