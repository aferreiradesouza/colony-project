import { MenuEnum } from '../../interface/enums/menu.enum';
import { Menu, MenuItem } from '../../interface/interface';

export const MENU: Menu[] = [
    {
        label: 'MENU.GENERAL.TITLE',
        children: [
            {
                id: MenuEnum.summary,
                label: 'MENU.GENERAL.SUMMARY',
                icon: 'chartBarSquare',
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
                icon: 'userGroup',
                url: '/settlers',
            },
            {
                id: MenuEnum.storage,
                label: 'MENU.GENERAL.STORAGE',
                icon: 'archiveBox',
                url: '/storage',
            },
        ],
    },
    {
        label: 'MENU.SETTLERS.TITLE',
        children: [
            {
                id: MenuEnum.policies,
                label: 'MENU.SETTLERS.POLICIES',
                icon: 'chartBarSquare',
                url: '/settlers/policies',
            },
            {
                id: MenuEnum.works,
                label: 'MENU.SETTLERS.WORKS',
                icon: 'home',
                url: '/settlers/works',
            },
            {
                id: MenuEnum.routine,
                label: 'MENU.SETTLERS.ROUTINE',
                icon: 'userGroup',
                url: '/settlers/routine',
            },
        ],
    },
    {
        label: 'MENU.BASE.TITLE',
        children: [
            {
                id: MenuEnum.construction,
                label: 'MENU.BASE.CONSTRUCTION',
                icon: 'chartBarSquare',
                url: '/base/construction',
            },
            {
                id: MenuEnum.storage,
                label: 'MENU.BASE.STORAGE',
                icon: 'home',
                url: '/base/storage',
            },
        ],
    },
    {
        label: 'MENU.WORLD.TITLE',
        children: [
            {
                id: MenuEnum.wildLife,
                label: 'MENU.WORLD.WILD_LIFE',
                icon: 'chartBarSquare',
                url: '/world/wild-life',
            },
            {
                id: MenuEnum.biomes,
                label: 'MENU.WORLD.BIOMES',
                icon: 'home',
                url: '/world/biomes',
            },
        ],
    },
];

export const GET_MENU = (id: MenuEnum): MenuItem => {
    const menu = MENU.map((e) => e.children).flat();
    return menu.find((e) => e.id === id)!;
};
