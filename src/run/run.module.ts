import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RunService } from './run.service';
import { Run, RunSchema } from './run.model';

@Module({
  providers: [RunService],
  imports: [MongooseModule.forFeature([{ name: Run.name, schema: RunSchema }])],
})
export class RunModule {}
