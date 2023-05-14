import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sale } from './schemas/sale.schema';
import { Model } from 'mongoose';
import { NftService } from '../nft/nft.service';
import { getLogsFromTransaction } from 'src/blockchain/utils/transaction';
import * as marketAbi from 'src/blockchain/abi/contracts/marketplace/Marketplace.sol/Marketplace.json';
import { Interface, getAddress } from 'ethers';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale.name) private model: Model<Sale>,
    private readonly nftService: NftService,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const nft = await this.nftService.findOneByTokenId(
      createSaleDto.tokenId,
      createSaleDto.tokenAddress,
    );

    if (!nft) {
      throw new Error('NFT not found');
    }

    return this.model.updateOne(
      {
        nft: nft._id,
      },
      {
        sellerAddress: createSaleDto.sellerAddress,
        price: createSaleDto.price,
        nft: nft._id,
        listTime: new Date(),
        signature: createSaleDto.signature,
      },
      {
        upsert: true,
      },
    );
  }

  async buyByHash(txHash: string) {
    const logs = await getLogsFromTransaction(
      txHash,
      'NFTBought',
      new Interface(marketAbi),
    );
    for await (const log of logs) {
      const { _buyer, _seller, _tokenAddress, _tokenId } = log.args;

      const nft = await this.nftService.updateOwner(
        _tokenId.toString(),
        _tokenAddress,
      );

      await this.model.findOneAndDelete({
        nft: nft._id,
        sellerAddress: getAddress(_seller),
      });
    }
  }

  findAll() {
    return this.model.find().populate('nft');
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }
}
