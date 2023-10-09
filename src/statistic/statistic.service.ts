import { Injectable } from '@nestjs/common';

import { RunService } from '../run/run.service';
import { ShoeService } from '../shoe/shoe.service';

@Injectable()
export class StatisticService {
  constructor(
    private readonly runService: RunService,
    private readonly shoeService: ShoeService,
  ) {}

  async getStatistic(userId: string) {
    const allUserRuns = await this.runService.findAllUserRuns(userId);
    const sumDistance = allUserRuns.reduce(
      (acc, { trDistance }) => acc + trDistance,
      0,
    );
    const avgDistance = sumDistance / allUserRuns.length;

    const allShoes = await this.shoeService.findAllUserShoes(userId);
    const activeShoes = allShoes.filter(({ active }) => active);
    const sumActiveDurability = activeShoes.reduce(
      (acc, { totalDurability, currentDurability }) =>
        acc + (totalDurability - currentDurability),
      0,
    );

    return {
      sumDistance, //--------------------- sum of all runs
      avgDistance, //--------------------- avarage distance by all runs
      shoesLength: allShoes.length, //---- count of all sneakers
      activeShoes: activeShoes.length, //- count of active (not broken) sneakers
      sumActiveDurability, //------------- rest of durability from all active sneakers,
    };
  }
}
