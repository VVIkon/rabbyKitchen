import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, FilterQuery } from 'mongoose';
import { Repository } from './interfaces/repository.interface';

@Injectable()
export class MongoService<T extends Document> implements Repository<T> {
	constructor(@InjectModel('PersonData') private readonly personModel: Model<T>) {}

	async create(item: Partial<T>): Promise<T> {
		return this.personModel.create(item);
	}

	async findById(id: string): Promise<T | null> {
		return this.personModel.findById(id).exec();
	}

	// async findByField(field: string, value: string): Promise<T[] | null> {
	// 	if (!field || value === undefined || value === null) {
	// 		return null;
	// 	}
	// 	const query: FilterQuery<typeof this.personModel> = { [field]: value };
	// 	const retVal = await this.personModel.find(query).exec();
	// 	return retVal?.length ? retVal : null;
	// }

	async findAll(): Promise<T[]> {
		return await this.personModel.find().exec();
	}

	async update(id: string, item: Partial<T>): Promise<T | null> {
		return this.personModel.findByIdAndUpdate(id, item, { new: true }).exec();
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.personModel.deleteOne({ _id: id }).exec();
		return result.deletedCount > 0;
	}
}
