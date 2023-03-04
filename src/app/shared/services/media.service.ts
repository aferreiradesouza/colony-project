import { EventEmitter, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MediaService {
    public onResize = new EventEmitter<Event>();

    constructor() {}

    get sm(): number {
        return 640;
    }

    get md(): number {
        return 768;
    }

    get lg(): number {
        return 1024;
    }

    get xl(): number {
        return 1280;
    }
}
