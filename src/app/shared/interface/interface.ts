import { MenuEnum } from './enum';

export interface Menu {
    label: string;
    children: MenuItem[];
}

export interface MenuItem {
    id: MenuEnum;
    label: string;
    icon: string;
    url: string;
}
