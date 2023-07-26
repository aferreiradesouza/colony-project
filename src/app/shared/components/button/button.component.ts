import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    ButtonSizeEnum,
    ButtonThemeEnum,
    ButtonTypeEnum,
} from '../../interface/enums/button.enum';
import { ButtonSize, ButtonTheme, ButtonType } from '../../interface/type';

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
                return 'simple-outline';

            default:
                return '';
        }
    }

    get themeClass(): string {
        switch (ButtonThemeEnum[this.theme]) {
            case ButtonThemeEnum.primary:
                return 'primary';

            case ButtonThemeEnum.secondary:
                return 'secondary';

            case ButtonThemeEnum.terciary:
                return 'terciary';

            case ButtonThemeEnum.danger:
                return 'danger';

            case ButtonThemeEnum.warning:
                return 'warning';

            case ButtonThemeEnum.info:
                return 'info';

            case ButtonThemeEnum.success:
                return 'success';

            default:
                return '';
        }
    }

    get sizeClass(): string {
        switch (ButtonSizeEnum[this.size]) {
            case ButtonSizeEnum.xTiny:
                return 'px-2 py-1 text-xxs';
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
