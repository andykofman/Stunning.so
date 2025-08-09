import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const isTestEnv = Boolean(process.env.JEST_WORKER_ID) || process.env.NODE_ENV === 'test';

    if (isTestEnv) {
      Logger.warn('Skipping MongoDB connection in test environment', DatabaseModule.name);
      return { module: DatabaseModule };
    }

    const mongooseImport = MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI');

        if (!mongoUri) {
          throw new Error(
            'MONGODB_URI is not set. Please define it in your environment (e.g., in .env).',
          );
        }

        return {
          uri: mongoUri,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
          autoIndex: true,
          connectionFactory: (connection: Connection) => {
            Logger.log('Connected to MongoDB', DatabaseModule.name);
            return connection;
          },
        };
      },
    });

    return {
      module: DatabaseModule,
      imports: [mongooseImport],
      exports: [mongooseImport],
    };
  }
}


