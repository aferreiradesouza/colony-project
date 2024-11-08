import { EventEmitter, Injectable } from '@angular/core';
import { NotificationEnum } from '../interface/enums/notification.enum';
import { NotificationItem } from '../interface/interface';
import { HelperService } from './helpers.service';
import { ShortcutService } from './shortcut.service';

interface NotificationModel {
    title: string;
    message: string;
    type: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    public notifications: NotificationItem[] = [];
    readonly notificationModel: {
        [key in NotificationEnum]: NotificationModel;
    } = {
        [NotificationEnum.BuildingSuccess]: {
            title: '{{title}} finalizado(a)',
            message: '{{title}} finalizado(a) com sucesso!',
            type: 'success',
        },
        [NotificationEnum.ItemAdded]: {
            title: '{{title}} adicionado(a)',
            message: '{{title}} adicionado(a) com sucesso!',
            type: 'success',
        },
        [NotificationEnum.ItemRemoved]: {
            title: '{{title}} removido(a)',
            message: '{{title}} removido(a) com sucesso!',
            type: 'success',
        }
    };
    public onChangeNotificationList = new EventEmitter<NotificationItem[]>();

    constructor(private shortcutService: ShortcutService) {
        this.startSubscriptionShortcutTab();
    }

    buildingSuccess(vars: { [key: string]: string }): void {
        const notificationModel = Object.assign(
            {},
            this.notificationModel[NotificationEnum.BuildingSuccess]
        );
        this.replaceVars(notificationModel, vars);
        this.add({
            id: HelperService.guid,
            isNew: this.shortcutService.activeTab !== 'notifications',
            ...notificationModel,
        });
    }

    itemAddedSuccess(vars: { [key: string]: string }): void {
        const notificationModel = Object.assign(
            {},
            this.notificationModel[NotificationEnum.ItemAdded]
        );
        this.replaceVars(notificationModel, vars);
        this.add({
            id: HelperService.guid,
            isNew: this.shortcutService.activeTab !== 'notifications',
            ...notificationModel,
        });
    }

    itemRemovedSuccess(vars: { [key: string]: string }): void {
        const notificationModel = Object.assign(
            {},
            this.notificationModel[NotificationEnum.ItemRemoved]
        );
        this.replaceVars(notificationModel, vars);
        this.add({
            id: HelperService.guid,
            isNew: this.shortcutService.activeTab !== 'notifications',
            ...notificationModel,
        });
    }

    private replaceVars(notificationModel: NotificationModel, vars: { [key: string]: string }): void {
        for (const key in vars) {
            notificationModel.title = notificationModel.title.replace(
                `{{${key}}}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (vars as any)[key as any]
            );
            notificationModel.message = notificationModel.message.replace(
                `{{${key}}}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (vars as any)[key as any]
            );
        }
    }

    private add(notification: NotificationItem): void {
        this.notifications.unshift(notification);
        this.onChangeNotificationList.emit(this.notifications);
    }

    remove(id: string): void {
        const index = this.notifications.findIndex((e) => e.id === id);
        if (index > -1) this.notifications.splice(index, 1);
        this.onChangeNotificationList.emit(this.notifications);
    }

    private startSubscriptionShortcutTab(): void {
        this.shortcutService.onChangeTab.subscribe((event) => {
            if (event === 'notifications') {
                this.notifications.forEach((e) => (e.isNew = false));
                this.onChangeNotificationList.emit(this.notifications);
            }
        });
    }

    get newNotifications(): NotificationItem[] {
        return this.notifications.filter((e) => e.isNew);
    }
}
