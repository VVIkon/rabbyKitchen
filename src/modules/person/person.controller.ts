import { Controller, Get, Post, Delete, Param, Body, ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MongoService } from '../mongo/mongo.service';
import { PersonDTO, CreatePersonDTO, UpdatePersonDTO, PersonResponseDTO } from './dto/person.dto';

@ApiTags('Persons')
@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
export class PersonController {
	private readonly collectionName = 'Person';
	private readonly personsCollection;

	constructor(
		private readonly mongoService: MongoService
	) {
		this.personsCollection = this.mongoService.forCollection<PersonDTO>('Person');
	}

	@Get('persons')
	@ApiResponse({ status: 200, type: [PersonDTO] })
	async getAllPersons(): Promise<PersonDTO[]> {
		return await this.personsCollection.select_all();
	}

	@Get('persons/:id')
	@ApiParam({ name: 'id', type: String })
	@ApiResponse({ status: 200, type: PersonResponseDTO })
	async getPersonById(@Param('id', ParseUUIDPipe) id: string): Promise<PersonDTO | null> {
		const persons = await this.personsCollection.select(id);
		return persons.length > 0 ? persons[0] : null;
	}

	@Get('persons/name/:name')
	@ApiParam({ name: 'name', type: String })
	@ApiResponse({ status: 200, type: [PersonResponseDTO] })
	async getPersonsByName(@Param('name') name: string): Promise<PersonDTO[]> {
		return this.personsCollection.find(this.collectionName, 'lastName', name);
	}

	@Post('person')
	@ApiResponse({ status: 201, type: PersonResponseDTO })
	async createPerson(@Body() personData: CreatePersonDTO): Promise<PersonDTO> {
		return this.personsCollection.create(personData);
	}

	@Post('person/:id')
	@ApiParam({ name: 'id', type: String })
	@ApiResponse({ status: 200, type: PersonResponseDTO })
	async updatePerson(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateData: UpdatePersonDTO,
	): Promise<PersonDTO | null> {
		return this.personsCollection.update(id, updateData);
	}

	@Delete('person/:id')
	@ApiParam({ name: 'id', type: String })
	@ApiResponse({ status: 200, type: Boolean })
	async deletePerson(@Param('id', ParseUUIDPipe) id: string): Promise<{ success: boolean }> {
		const result = await this.personsCollection.delete(id);
		return { success: result };
	}
}
