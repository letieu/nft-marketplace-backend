import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export abstract class BaseModel {
  @Prop()
  createdAt: Date; // provided by schemaOptions.timestamps
  @Prop()
  updatedAt: Date; // provided by schemaOptions.timestamps
}
