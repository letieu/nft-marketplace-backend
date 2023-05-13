import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseModel } from 'src/global/base.model';
import { Nft } from 'src/modules/nft/schemas/nft.schema';

@Schema()
export class Sale extends BaseModel {
  @Prop()
  sellerAddress: string;

  @Prop()
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Nft' })
  nft: Nft;

  @Prop()
  listTime: Date;

  @Prop()
  signature: string;
}

export type SaleDocument = HydratedDocument<Sale>;

export const SaleSchema = SchemaFactory.createForClass(Sale);
