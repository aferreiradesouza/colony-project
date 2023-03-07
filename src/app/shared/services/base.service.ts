import { Injectable } from '@angular/core';
import {
    ConstructionDatabase,
    CONSTRUCTIONS,
} from '../database/constructions.database';
import { Constructions } from '../model/base/construction.model';

@Injectable({ providedIn: 'root' })
export class BaseService {
    constructor() {}

    get constructionsList(): ConstructionDatabase[] {
        return Object.values(CONSTRUCTIONS);
    }

    getConstruction(id: Constructions): ConstructionDatabase {
        return CONSTRUCTIONS[id];
    }
}
