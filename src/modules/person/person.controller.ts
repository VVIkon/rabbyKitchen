import { Controller, Get, Post, Delete, Param, Body, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PersonService } from './person.service';
import { PersonData, Person } from "./dto/person-data.schema";


@ApiTags('Persons')
@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
export class PersonController {

	constructor(
		private readonly personService: PersonService,
	) {}

	@Get('persons/:id')
	@ApiParam({ name: 'id', type: String })
	@ApiResponse({ status: 200, type: PersonData })
	async getPersonById(@Param('id') id: string): Promise<PersonData | null> {
		const person = await this.personService.getPersonById(id);
		return person;
	}

	@Get('persons')
	@ApiResponse({ status: 200, type: [PersonData] })
	async getAllPersons(): Promise<PersonData[]> {
		const retVal = await this.personService.getAllPersons();
		return retVal;
	}


	@Get('persons/name/:name')
	@ApiParam({ name: 'name', type: String })
	@ApiResponse({ status: 200, type: [PersonData] })
	async getPersonsByName(@Param('name') name: string): Promise<PersonData[]| null> {
		const persons = await this.personService.getPersonsByName(name);
		return persons
	}

	@Post('person')
	@ApiResponse({ status: 201, type: PersonData })
	async createPerson(@Body() personData: PersonData): Promise<PersonData | null> {
		return await this.personService.createPerson(personData);
	}

	@Post('person/:id')
	@ApiParam({ name: 'id', type: String })
	@ApiResponse({ status: 200, type: PersonData })
	async updatePerson(	@Param('id') id: string,	@Body() updateData: PersonData): Promise<PersonData | null> {
		return await this.personService.updatePerson(id, updateData);
	}

	@Delete('person/:id')
	@ApiParam({ name: 'id', type: String })
	@ApiResponse({ status: 200, type: Boolean })
	async deletePerson(@Param('id') id: string): Promise<{ success: boolean }> {
		const result = await this.personService.deletePerson(id);
		return { success: result };
	}
}
