import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { MONGODB_OPTIONS } from './mongo.constants';
import { MongoDBOptions } from './mongo-options.interface';

@Injectable()
export class MongoService {
	private database: string;

	constructor(
		@Inject(MONGODB_OPTIONS) private options: MongoDBOptions,
		@InjectModel('DynamicModel') private dynamicModel: Model<any>,
	) {
		this.database = options.database;
	}

	// ...

	private createEmptySchema(): any {
		const SchemaConstructor = this.dynamicModel.schema.constructor as typeof Schema;
		return new SchemaConstructor({});
	}

	public forCollection<T>(collectionName: string): {
		select: (filter?: any) => Promise<T[]>;
		select_all: () => Promise<T[]>;
		create: (data: any) => Promise<T>;
		update: (id: string, data: any) => Promise<T | null>;
		delete: (id: string) => Promise<boolean>;
		find: (field: string, value: any) => Promise<T[]>;
	} {
		return {
			select: (filter = {}) => this.select<T>(collectionName, filter),
			select_all: () => this.select_all<T>(collectionName),
			create: (data) => this.create<T>(collectionName, data),
			update: (id, data) => this.update<T>(collectionName, id, data),
			delete: (id) => this.delete(collectionName, id),
			find: (field, value) => this.find<T>(collectionName, field, value),
		};
	}

	public setModel(modelName: string, schema: any): void {
		this.dynamicModel = this.dynamicModel.discriminator(modelName, schema);
	}

	async select<T>(modelName: string, filter: any = {}): Promise<T[]> {
		this.setModel(modelName, this.createEmptySchema());
		return this.dynamicModel.find(filter).exec();
	}

	async select_all<T>(modelName: string): Promise<T[]> {
		return this.select<T>(modelName);
	}

	async create<T>(modelName: string, data: any): Promise<T> {
		this.setModel(modelName, this.createEmptySchema());
		const createdItem = new this.dynamicModel(data);
		return createdItem.save();
	}

	async update<T>(modelName: string, id: string, data: any): Promise<T | null> {
		this.setModel(modelName, this.createEmptySchema());
		return this.dynamicModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async delete(modelName: string, id: string): Promise<boolean> {
		this.setModel(modelName, this.createEmptySchema());
		const result = await this.dynamicModel.findByIdAndDelete(id).exec();
		return !!result;
	}

	async find<T>(modelName: string, field: string, value: any): Promise<T[]> {
		this.setModel(modelName, this.createEmptySchema());
		const query = { [field]: value };
		return this.dynamicModel.find(query).exec();
	}
}
