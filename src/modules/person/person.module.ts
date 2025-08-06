import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { PersonController } from './person.controller';

@Module({
  imports: [MongoModule],
  controllers: [PersonController],
})
export class PersonModule {}
