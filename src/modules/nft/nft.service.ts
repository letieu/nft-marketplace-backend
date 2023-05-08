import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { getAddress, isAddress } from 'ethers';
import { Model } from 'mongoose';
import { CreateNftDto } from './dto/create-nft.dto';
import * as collectionAbi from 'src/blockchain/abi/contracts/collection/Collection.sol/Collection.json';
import { UpdateNftDto } from './dto/update-nft.dto';
import { Nft } from './schemas/nft.schema';
import { getContract } from 'src/blockchain/utils/common';
import { getNftMetadata } from 'src/external-api/ipfs';
import { getTransaction } from 'src/blockchain/utils/transaction';

@Injectable()
export class NftService {
  constructor(@InjectModel(Nft.name) private model: Model<Nft>) {}

  async create(dto: CreateNftDto) {
    if (!isAddress(dto.tokenAddress)) {
      throw new HttpException(
        'Invalid contract address',
        HttpStatus.BAD_REQUEST,
      );
    }

    const oldNft = await this.model.findOne({
      tokenId: dto.tokenId,
      tokenAddress: getAddress(dto.tokenAddress),
    });

    if (oldNft) {
      throw new HttpException('NFT already exists', HttpStatus.BAD_REQUEST);
    }

    const contract = getContract(dto.tokenAddress, collectionAbi);

    // wait for mint transaction success
    const mintTransaction = await getTransaction(dto.txHash);
    await mintTransaction.wait();

    const ownerAddress = await contract.ownerOf(dto.tokenId);
    const tokenUri = await contract.tokenURI(dto.tokenId);
    const metadata = await getNftMetadata(tokenUri);

    return this.model.create({
      tokenId: dto.tokenId,
      tokenAddress: getAddress(dto.tokenAddress),
      uri: tokenUri,
      ownerAddress: getAddress(ownerAddress),
      creatorAddress: getAddress(ownerAddress),
      metadata: metadata,
    });
  }

  findByOwner(ownerAddress: string) {
    return this.model.find({ ownerAddress: getAddress(ownerAddress) });
  }

  findAll() {
    return `This action returns all nft`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nft`;
  }

  update(id: number, updateNftDto: UpdateNftDto) {
    return `This action updates a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }
}
