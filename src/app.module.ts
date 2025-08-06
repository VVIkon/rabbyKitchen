import { Module } from '@nestjs/common';
import { PersonModule } from './modules/person/person.module';
import { MongoModule } from './modules/mongo/mongo.module';

@Module({
  imports: [MongoModule, PersonModule],
})
export class AppModule {}
