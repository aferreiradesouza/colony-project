import { Injectable } from '@angular/core';
import { ShortCrypt } from 'short-crypt';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CryptHandlerService {
    private _crypt: ShortCrypt;

    constructor() {
        this._crypt = new ShortCrypt(environment.key_crypt);
    }

    public encrypt(value: string): string {
        return this._crypt.encryptToURLComponent(value);
    }

    public decrypt(value: string): string {
        const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
        return utf8Decoder.decode(
            this._crypt.decryptURLComponent(value) as Uint8Array,
            {}
        );
    }
}
