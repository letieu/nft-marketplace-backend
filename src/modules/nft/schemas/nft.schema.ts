import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NftMetadata } from '../types/metadata.type';
import { BaseModel } from 'src/global/base.model';

@Schema()
export class Nft extends BaseModel {
  @Prop()
  tokenId: string;

  @Prop()
  tokenAddress: string;

  @Prop()
  uri: string;

  @Prop()
  ownerAddress: string;

  @Prop()
  creatorAddress: string;

  @Prop({ type: Object })
  metadata: NftMetadata;
}

export type NftDocument = HydratedDocument<Nft>;

export const NftSchema = SchemaFactory.createForClass(Nft);
