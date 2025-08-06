import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ strict: false, timestamps: true })
export class DynamicModel extends Document {
  // Базовые поля, если нужны
  @Prop()
  modelName?: string;

  // Остальные поля будут динамическими благодаря strict: false
}

export const DynamicModelSchema = SchemaFactory.createForClass(DynamicModel);
