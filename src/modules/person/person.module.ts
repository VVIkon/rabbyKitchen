import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { PersonController } from './person.controller';
import { PersonService } from "./person.service";

@Module({
	imports: [MongoModule],
	controllers: [PersonController],
	providers: [PersonService],
	exports: [PersonService],
})
export class PersonModule {}
