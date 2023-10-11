import { Injectable, BadRequestException } from '@nestjs/common';

import { RunService } from '../run/run.service';
import { ShoeService } from '../shoe/shoe.service';
import { Run } from '../run/run.model';
import { STAT_ERRS } from '../global/errors';

@Injectable()
export class StatisticService {
  constructor(
    private readonly runService: RunService,
    private readonly shoeService: ShoeService,
  ) {}

  async getStatistic(userId: string) {
    let sumActiveWeeks = 0;
    let avgDistansePerWeek = 0;

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

  async getBrokenDate(userId: string, shoeId: string) {
    const shoe = await this.shoeService.findShoe(shoeId);
    await this.shoeService.checkShoeOwner(userId, String(shoe.user));

    const restDurability = shoe.totalDurability - shoe.currentDurability;
    const { avgDistansePerWeek } = await this.getStatistic(userId);
    if (restDurability <= 0) {
      throw new BadRequestException(STAT_ERRS.emptyDurability);
    }
    if (avgDistansePerWeek <= 0) {
      throw new BadRequestException(STAT_ERRS.emptyAvgDistancePerWeek);
    }

    const restWeeks = Math.floor(restDurability / avgDistansePerWeek);
    const brokenDate = new Date(
      +Date.now() + restWeeks * (7 * 24 * 60 * 60 * 1000),
    );

    return {
      finishDateStr: brokenDate,
      finishDate: brokenDate.toDateString(),
      restWeeks,
    };
  }
}
