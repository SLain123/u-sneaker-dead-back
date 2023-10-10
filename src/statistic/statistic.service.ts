import { Injectable } from '@nestjs/common';

import { RunService } from '../run/run.service';
import { ShoeService } from '../shoe/shoe.service';
import { Run } from '../run/run.model';

@Injectable()
export class StatisticService {
  constructor(
    private readonly runService: RunService,
    private readonly shoeService: ShoeService,
  ) {}

  async getStatistic(userId: string) {
    let avgDistansePerWeek = 0;
    let sumActiveWeeks = 0;

    const allUserRuns = await this.runService.findAllUserRuns(userId);
    const sumDistance = allUserRuns.reduce(
      (acc, { trDistance }) => acc + trDistance,
      0,
    );
    const avgDistancePerRun = sumDistance / allUserRuns.length;

    const allShoes = await this.shoeService.findAllUserShoes(userId);
    const activeShoes = allShoes.filter(({ active }) => active);
    const sumActiveDurability = activeShoes.reduce(
      (acc, { totalDurability, currentDurability }) =>
        acc + (totalDurability - currentDurability),
      0,
    );

    const sortedRuns = allUserRuns.sort(
      (a: Run, b: Run) => +a.trDate - +b.trDate,
    );
    if (sortedRuns.length > 1) {
      const firstRun = sortedRuns[0].trDate;
      const lastRun = sortedRuns[sortedRuns.length - 1].trDate;

      sumActiveWeeks = Math.round(
        (+lastRun - +firstRun) / (1000 * 60 * 60 * 24 * 7),
      );
      avgDistansePerWeek = +(sumDistance / sumActiveWeeks).toFixed(2);
    }

    return {
      sumDistance, //--------------------- sum of all runs in km
      avgDistancePerRun, //--------------- average distance per one run in km
      avgDistansePerWeek, //-------------- average distance per week in km
      sumActiveWeeks, //------------------ count of active time for all time in weeks
      shoesLength: allShoes.length, //---- count of all sneakers in unit
      activeShoes: activeShoes.length, //- count of active (not broken) sneakers in unit
      sumActiveDurability, //------------- rest of durability from all active sneakers in km
    };
  }
}
