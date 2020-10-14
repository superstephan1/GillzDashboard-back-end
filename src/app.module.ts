import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerStatusService } from './server-status/server-status.service';
import { ServerStatusController } from './server-status/server-status.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { DeadlinesService } from './deadlines/deadlines.service';
import { DeadlinesController } from './deadlines/deadlines.controller';
import {DeadlinesEntity} from "./deadlines/deadlines.entity";
import {DeadlinesModule} from "./deadlines/deadlines.module";
import { MembersModule } from './members/members.module';
import {MemberEntity} from "./members/entities/member.entity";
import {ServerStatusModule} from "./server-status/server-status-module";
import {ServerStatusEntity} from "./server-status/server-status.entity";

@Module({
  imports: [TerminusModule, ConfigModule.forRoot(), TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [DeadlinesEntity, MemberEntity, ServerStatusEntity],
    synchronize: true,
  }), MembersModule, DeadlinesModule, ServerStatusModule],
  controllers: [AppController, ServerStatusController, HealthController, DeadlinesController],
  providers: [AppService, ServerStatusService, DeadlinesService],
})
export class AppModule {}