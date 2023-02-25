import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    ButtonSizeEnum,
    ButtonThemeEnum,
    ButtonTypeEnum,
} from '../../types/enum';
import { ButtonSize, ButtonTheme, ButtonType } from '../../types/type';

@Component({
    selector: 'app-button',
    templateUrl: 'button.component.html',
    styleUrls: ['button.component.scss'],
})
export class ButtonComponent {
    @Input() label!: string | number;
    @Input() theme: ButtonTheme = 'primary';
    @Input() type: ButtonType = 'default';
    @Input() size: ButtonSize = 'medium';
    @Input() fullWidth = false;
    @Input() disabled = false;
    @Input() loading = false;

    @Output() clickEvent = new EventEmitter();

    constructor() {}

    getClass(): string[] {
        const cls: string[] = [this.themeClass, this.typeClass, this.sizeClass];
        if (this.fullWidth) cls.push('w-full');
        return cls;
    }

    get typeClass(): string {
        switch (ButtonTypeEnum[this.type]) {
            case ButtonTypeEnum.default:
                return 'default';
            case ButtonTypeEnum.outline:
                return 'outline';
            case ButtonTypeEnum.secondary:
                return 'secondary';
            default:
                return '';
        }
    }

    get themeClass(): string {
        switch (ButtonThemeEnum[this.theme]) {
            case ButtonThemeEnum.primary:
                return 'border-transparent bg-blue-500 text-white enabled:hover:bg-blue-700 focus:ring-blue-500';

            case ButtonThemeEnum.secondary:
                return 'border-transparent bg-blue-100 text-blue-700 enabled:hover:bg-blue-200 focus:ring-blue-100';

            case ButtonThemeEnum.terciary:
                return 'border-gray-300 bg-white text-gray-700 focus:ring-gray-100';

            case ButtonThemeEnum.danger:
                return 'border-transparent bg-red-600 text-white enabled:hover:bg-red-700 focus:ring-red-600';

            case ButtonThemeEnum.warning:
                return 'border-transparent bg-yellow-500 text-white enabled:hover:bg-yellow-600 focus:ring-yellow-500';

            case ButtonThemeEnum.info:
                return 'border-transparent bg-cyan-500 text-white enabled:hover:bg-cyan-600 focus:ring-cyan-500';

            case ButtonThemeEnum.success:
                return 'border-transparent bg-green-500 text-white enabled:hover:bg-green-600 focus:ring-green-500';

            default:
                return '';
        }
    }

    get sizeClass(): string {
        switch (ButtonSizeEnum[this.size]) {
            case ButtonSizeEnum.tiny:
                return 'px-2.5 py-1.5 text-xs';
            case ButtonSizeEnum.small:
                return 'px-3 py-2 text-sm';
            case ButtonSizeEnum.medium:
                return 'px-4 py-2 text-sm';
            case ButtonSizeEnum.big:
                return 'px-4 py-2 text-base';
            case ButtonSizeEnum.giant:
                return 'px-6 py-3 text-base';
            default:
                return '';
        }
    }

    handlerEvent(): void {
        if (!this.disabled || !this.loading) this.clickEvent.emit();
    }
}
