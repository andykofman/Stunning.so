import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { DatabaseModule } from './database/database.module';
import { IdeasModule } from './ideas/ideas.module';

const isTestEnv = Boolean(process.env.JEST_WORKER_ID) || process.env.NODE_ENV === 'test';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    DatabaseModule.forRoot(),
    ...(isTestEnv ? [] : [IdeasModule]),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
