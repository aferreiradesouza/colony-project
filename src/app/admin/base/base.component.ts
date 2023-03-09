import { Component } from '@angular/core';
import { Construction } from 'src/app/shared/model/base/construction.model';
import { BaseService } from 'src/app/shared/services/base.service';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
    constructor(private baseService: BaseService) {}

    get constructions(): Construction[] {
        return this.baseService.contructions;
    }
}
