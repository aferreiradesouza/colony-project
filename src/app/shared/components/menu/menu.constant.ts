import { MenuEnum } from '../../interface/enum';
import { Menu, MenuItem } from '../../interface/interface';

export const MENU: Menu[] = [
    {
        label: 'MENU.GENERAL.SECTION',
        children: [
            {
                id: MenuEnum.summary,
                label: 'MENU.GENERAL.SUMMARY',
                icon: 'chart-bar-square',
                url: '/summary',
            },
            {
                id: MenuEnum.base,
                label: 'MENU.GENERAL.BASE',
                icon: 'home',
                url: '/base',
            },
            {
                id: MenuEnum.settlers,
                label: 'MENU.GENERAL.SETTLERS',
                icon: 'user-group',
                url: '/settlers',
            },
        ],
    },
    {
        label: 'MENU.WORLD.SECTION',
        children: [
            {
                id: MenuEnum.summary,
                label: 'MENU.WORLD.SUMMARY',
                icon: 'chart-bar-square',
                url: '/summary',
            },
            {
                id: MenuEnum.base,
                label: 'MENU.WORLD.BASE',
                icon: 'home',
                url: '/base',
            },
            {
                id: MenuEnum.settlers,
                label: 'MENU.WORLD.SETTLERS',
                icon: 'user-group',
                url: '/settlers',
            },
        ],
    },
];

export const GET_MENU = (id: MenuEnum): MenuItem => {
    const menu = MENU.map((e) => e.children).flat();
    return menu.find((e) => e.id === id)!;
};
