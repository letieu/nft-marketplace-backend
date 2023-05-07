import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { getAddress } from 'ethers';
import { UserStatusEnum } from './interfaces/userStatus.enum';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async findAll(page: number, limit: number) {
    const findQuery = this.model.find();

    const count = await this.model.find().merge(findQuery).countDocuments();

    return {
      items: await findQuery
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      metadata: {
        total: count,
      },
    };
  }

  async findOne(id: string) {
    return await this.model.findById(id).exec();
  }

  async findOneByAddress(address: string) {
    return await this.model.findOne({ address: getAddress(address) });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.model.findOne({ email: email }, { password: 0 }).exec();
  }

  async findOneByUsername(username: string, excludePassword = true) {
    return await this.model
      .findOne({ username }, { password: excludePassword ? 0 : 1 })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return this.model.findByIdAndRemove(id);
  }

  async findByAddress(address: string) {
    return this.model
      .findOne({
        address: address,
      })
      .exec();
  }

  async findByAddressIncludeNonce(address: string) {
    return this.model
      .findOne({
        address: getAddress(address),
      })
      .select({ nonce: 1 })
      .exec();
  }

  async updateUserNonce(address: string, nonce: string) {
    const user = await this.findByAddressIncludeNonce(address);
    if (user) {
      user.nonce = nonce;
      await user.save();
    } else {
      const newUser = new this.model({
        address: getAddress(address),
        username: address,
        title: 'Unnamed',
        status: UserStatusEnum.ACTIVE,
        nonce,
      });
      await newUser.save();
    }
  }

  async getUsersByAddress(addresses: string[]) {
    return await this.model.find({
      address: { $in: addresses.map((address) => address) },
    });
  }
}
