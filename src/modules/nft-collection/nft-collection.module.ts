import { Module } from '@nestjs/common';
import { NftCollectionService } from './nft-collection.service';
import { NftCollectionController } from './nft-collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NftCollection,
  NftCollectionSchema,
} from './schemas/nft-collection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NftCollection.name, schema: NftCollectionSchema },
    ]),
  ],
  controllers: [NftCollectionController],
  providers: [NftCollectionService],
})
export class NftCollectionModule {}
