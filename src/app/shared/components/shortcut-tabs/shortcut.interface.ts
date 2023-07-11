import { Icon } from '../../interface/type';

export interface ShortcutData {
    label: string;
    value: ShortcutTab;
    icon: Icon;
    notifications?: number | string;
}

export type ShortcutTab =
    | 'settlers'
    | 'notifications'
    | 'to-do-list'
    | 'inventory';

export interface ToDoListShortcut {
    work: string;
    id: string;
    progress: number;
    timeLeft: number;
}
