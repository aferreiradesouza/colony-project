import { Icon } from '../../interface/type';

export interface ShortcutData {
    label: string;
    value: ShortcutTab;
    icon: Icon;
}

export type ShortcutTab = 'settlers' | 'notifications' | 'to-do-list';
