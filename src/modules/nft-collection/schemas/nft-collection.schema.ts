import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from 'src/global/base.model';

@Schema()
export class NftCollection extends BaseModel {
  @Prop()
  tokenAddress: string;

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop()
  description: string;

  @Prop()
  ownerAddress: string;
}

export type NftCollectionDocument = HydratedDocument<NftCollection>;

export const NftCollectionSchema = SchemaFactory.createForClass(NftCollection);
