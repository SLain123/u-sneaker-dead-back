import { Module } from '@nestjs/common';
import { RunService } from './run.service';

@Module({
  providers: [RunService]
})
export class RunModule {}
