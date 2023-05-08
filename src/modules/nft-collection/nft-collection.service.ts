import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNftCollectionDto } from './dto/create-nft-collection.dto';
import { UpdateNftCollectionDto } from './dto/update-nft-collection.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NftCollection } from './schemas/nft-collection.schema';
import { Model } from 'mongoose';
import { getAddress, isAddress } from 'ethers';
import { getContract } from 'src/blockchain/utils/common';
import * as collectionAbi from 'src/blockchain/abi/contracts/collection/Collection.sol/Collection.json';
import { JwtPayload } from '../auth/types/jwtPayload.type';

@Injectable()
export class NftCollectionService {
  constructor(
    @InjectModel(NftCollection.name) private model: Model<NftCollection>,
  ) {}

  async create(dto: CreateNftCollectionDto) {
    if (!isAddress(dto.tokenAddress)) {
      throw new HttpException(
        'Invalid contract address',
        HttpStatus.BAD_REQUEST,
      );
    }

    const oldCollection = await this.model.findOne({
      tokenAddress: getAddress(dto.tokenAddress),
    });
    if (oldCollection) {
      throw new HttpException(
        'Collection already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const contract = getContract(dto.tokenAddress, collectionAbi);

    const owner = await contract.owner();
    const name = await contract.name();
    const symbol = await contract.symbol();

    const collection = await this.model.create({
      ...dto,
      ownerAddress: getAddress(owner),
      name: name,
      symbol: symbol,
    });

    return collection;
  }

  findByOwner(ownerAddress: string) {
    return this.model.find({ ownerAddress: getAddress(ownerAddress) });
  }

  findAll() {
    return this.model.find();
  }

  findOne(id: number) {
    return this.model.findById(id);
  }

  async update(
    id: string,
    updateNftCollectionDto: UpdateNftCollectionDto,
    auth: JwtPayload,
  ) {
    const collection = await this.model.findById(id);

    if (!collection) {
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);
    }

    if (collection.ownerAddress !== auth.address) {
      throw new HttpException(
        'You are not the owner of this collection',
        HttpStatus.FORBIDDEN,
      );
    }

    collection.description = updateNftCollectionDto.description;

    return collection.save();
  }

  async remove(id: string, auth: JwtPayload): Promise<any> {
    return this.model.deleteOne({
      _id: id,
      ownerAddress: auth.address,
    });
  }
}
