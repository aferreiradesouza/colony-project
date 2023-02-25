import { ButtonSizeEnum, ButtonThemeEnum, ButtonTypeEnum } from './enum';

export type ButtonTheme = keyof typeof ButtonThemeEnum;
export type ButtonType = keyof typeof ButtonTypeEnum;
export type ButtonSize = keyof typeof ButtonSizeEnum;
