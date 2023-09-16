import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RunModule } from './run/run.module';
import { ShoeModule } from './shoe/shoe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AuthModule,
    RunModule,
    ShoeModule,
  ],
})
export class AppModule {}
