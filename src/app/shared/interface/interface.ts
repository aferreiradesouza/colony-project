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

export interface NotificationItem {
    id?: string;
    type: string;
    title: string;
    message: string;
}
