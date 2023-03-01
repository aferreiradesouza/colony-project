import { ButtonSizeEnum, ButtonThemeEnum, ButtonTypeEnum, TextTypesEnum } from './enum';

export type ButtonTheme = keyof typeof ButtonThemeEnum;
export type ButtonType = keyof typeof ButtonTypeEnum;
export type ButtonSize = keyof typeof ButtonSizeEnum;

export type TextTypes = keyof typeof TextTypesEnum;
