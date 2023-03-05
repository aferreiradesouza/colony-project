import { MenuEnum } from './enums/menu.enum';
import { Icon } from './type';

export interface Menu {
    label: string;
    children: MenuItem[];
}

export interface MenuItem {
    id: MenuEnum;
    label: string;
    icon: Icon;
    url: string;
}
