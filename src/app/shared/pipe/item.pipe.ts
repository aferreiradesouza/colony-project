import { Pipe, PipeTransform } from '@angular/core';
import { ItemDatabase } from '../database/item.database';
import { Items } from '../interface/enums/item.enum';

@Pipe({
    name: 'item',
})
export class ItemPipe implements PipeTransform {
    transform(value: Items): string {
        return ItemDatabase.getItemById(value).name;
    }
}
