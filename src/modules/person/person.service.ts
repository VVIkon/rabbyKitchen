import { Injectable } from '@nestjs/common';
import { MongoService } from "../mongo/mongo.service";
import { PersonData } from "./dto/person-data.schema";

@Injectable()
export class PersonService {

	constructor(
		private readonly mongoService: MongoService<PersonData>
	) {}

	async getAllPersons(): Promise<PersonData[]> {
		const retVal = await this.mongoService.findAll();
		return retVal;
	}

	async getPersonById(id: string): Promise<PersonData | null> {
		const retVal = await this.mongoService.findById(id);
		return retVal;
	}
	// async getPersonsByName(name: string): Promise<PersonData[] | null> {
	// 	const retVal = await this.mongoService.findByField('name', name);
	// 	return retVal;
	// }
	async createPerson(personData: PersonData): Promise<PersonData | null> {
		const retVal = await this.mongoService.create(personData);
		return retVal;
	}
	async updatePerson(id: string, personData: PersonData): Promise<PersonData | null> {
		const retVal = await this.mongoService.update(id, personData);
		return retVal;
	}
	async deletePerson(id: string): Promise<boolean> {
		const retVal = await this.mongoService.delete(id);
		return retVal;
	}
}
