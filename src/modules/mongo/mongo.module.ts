import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoService } from './mongo.service';
import { MONGODB_OPTIONS } from './mongo.constants';
import { DynamicModel, DynamicModelSchema } from './schemas/dynamic.schema';


@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: DynamicModel.name, schema: DynamicModelSchema },
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [
        {
      provide: MONGODB_OPTIONS,
      useFactory: (configService: ConfigService) => ({
        database: configService.get<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService],
    },
    MongoService,
  ],
  exports: [MongoService],
})
export class MongoModule {}
