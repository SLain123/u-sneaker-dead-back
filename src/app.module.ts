import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RunModule } from './run/run.module';
import { ShoeModule } from './shoe/shoe.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:2k1U1nRgizw20GcI@cluster0.nxl8ldg.mongodb.net/?retryWrites=true&w=majority',
    ),
    UserModule,
    AuthModule,
    RunModule,
    ShoeModule,
  ],
})
export class AppModule {}
