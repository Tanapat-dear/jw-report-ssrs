import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MasterModule } from './master/master.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // DB1 connection
    TypeOrmModule.forRootAsync({
      name: 'masterdb_10_17_77_118',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB1_HOST'),
        port: Number(config.get('DB1_PORT') ?? 5432),
        username: config.get('DB1_USER'),
        password: config.get('DB1_PASS'),
        database: config.get('DB1_DBNAME'),
        synchronize: false, // ไม่มี entities
        entities: [],       // ไม่ต้องมี entity
      }),
    }),

    // DB2 connection
    TypeOrmModule.forRootAsync({
      name: 'jwdb_10_17_66_146',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB2_HOST'),
        port: Number(config.get('DB2_PORT') ?? 5432),
        username: config.get('DB2_USER'),
        password: config.get('DB2_PASS'),
        database: config.get('DB2_DBNAME'),
        synchronize: false,
        entities: [],
      }),
    }),

    MasterModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
