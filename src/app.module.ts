import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PersonModule } from './modules/person/person.module';
import { MongoModule } from './modules/mongo/mongo.module';

function validateConfig(config: Record<string, unknown>) {
	if (!config.SERVER_PORT || config.SERVER_PORT === 0) {
		throw new Error('Invalid Server Port in configuration');
	}
	if (!config.MONGODB_URI) {
		throw new Error('Invalid MongoDB in configuration');
	}

	return config;
}

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			validate: validateConfig,
		}),
		MongoModule,
		PersonModule,
	],
})
export class AppModule {}
