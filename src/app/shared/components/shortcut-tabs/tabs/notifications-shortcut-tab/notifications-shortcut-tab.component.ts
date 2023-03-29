import { Component } from '@angular/core';
import { NotificationItem } from 'src/app/shared/interface/interface';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-notifications-shortcut-tab',
    templateUrl: './notifications-shortcut-tab.component.html',
    styleUrls: ['./notifications-shortcut-tab.component.scss'],
})
export class NotificationsShortcutTabComponent {
    constructor(private notificationService: NotificationService) {}

    get notifications(): NotificationItem[] {
        return this.notificationService.notifications;
    }

    remove(id: string): void {
        this.notificationService.remove(id);
    }
}
