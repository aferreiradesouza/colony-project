import { Injectable } from '@angular/core';
import { Settler } from '../model/settler/settler.model';
import { Job } from '../model/settler/work.model';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class IAService {
    constructor(private gameService: GameService) {}

    public start() {
        setInterval(() => {
            this._checkStructures();
        }, 500);
    }

    private _checkStructures() {
        this.gameService.game.base.constructions.forEach((construction) => {
            if (construction.status === 'not-started') {
                const settler = this._getAvaibleSettler(
                    construction.jobToCreateStructure
                );
                if (settler) {
                    construction.assignSettler(
                        settler,
                        construction.jobToCreateStructure
                    );
                    construction.create();
                }
            }
            // else if (construction.status === 'done') {
            //     const settler = this._getAvaibleSettler(
            //         construction.jobToCreateStructure
            //     );
            //     if (settler) {
            //         construction.assignSettler(
            //             settler,
            //             construction.jobNecessary
            //         );
            //     }
            // }
        });
    }

    private _getAvaibleSettler(job: Job): Settler | null {
        return (
            this._getFirtOneAvailble(job) ||
            this._getSettlerWithWorkInProgress(job) ||
            null
        );
    }

    private _getSettlerWithWorkInProgress(job: Job): Settler | null {
        const settlersWithFilter = this.gameService.game.settlers
            .filter((e) => e.work.priorities.filter((f) => f.id === job).length)
            .filter(
                (e) =>
                    e.getWorkValue(e.work.workInProgressId) >=
                        e.getWorkValue(job) &&
                    e.getWorkWeight(e.work.workInProgressId) <
                        e.getWorkWeight(job)
            );
        if (!settlersWithFilter.length) return null;
        return this._getFirstPriority(settlersWithFilter, job);
    }

    private _getFirtOneAvailble(job: Job): Settler | null {
        const settlersWithFilter = this.gameService.game.settlers
            .filter((e) => e.work.priorities.filter((f) => f.id === job).length)
            .filter((e) => e.work.workInProgressId === Job.None);

        if (!settlersWithFilter.length) return null;

        return this._getFirstPriority(settlersWithFilter, job);
    }

    private _getFirstPriority(settlers: Settler[], job: Job) {
        return settlers.reduce((accumulator, currentValue) => {
            if (!accumulator) {
                return currentValue;
            } else {
                if (
                    currentValue.getWorkValue(job) <
                    accumulator.getWorkValue(job)
                )
                    return currentValue;
                else return accumulator;
            }
        });
    }
}
