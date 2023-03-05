import {
    ButtonSizeEnum,
    ButtonThemeEnum,
    ButtonTypeEnum,
} from './enums/button.enum';
import { IconEnum } from './enums/icon.enum';
import { TextTypesEnum } from './enums/text.enum';

export type ButtonTheme = keyof typeof ButtonThemeEnum;
export type ButtonType = keyof typeof ButtonTypeEnum;
export type ButtonSize = keyof typeof ButtonSizeEnum;
export type Icon = keyof typeof IconEnum;
export type TextTypes = keyof typeof TextTypesEnum;
