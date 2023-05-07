import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  encodeBytes32String,
  getAddress,
  isAddress,
  toUtf8Bytes,
  verifyMessage,
} from 'ethers';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interface/jwtPayload.interface';
import * as crypto from 'crypto';
import { createSignMessage } from './utils/sign';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async credentialByPassword(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.usersService.findOneByUsername(username, false);
    if (!user)
      throw new HttpException(
        'User not found, please register',
        HttpStatus.NOT_FOUND,
      );

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw new HttpException(
        'Username or Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );

    return user;
  }

  async genTokenFromUsername(username: string) {
    const user = await this.usersService.findOneByUsername(username);
    const payload: JwtPayload = {
      username: user.username,
      _id: user._id.toString(),
      address: user.address,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async genTokenFromSign(address: string, sign: string) {
    const user = await this.usersService.findByAddressIncludeNonce(address);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (sign.indexOf('0x') !== 0) {
      sign = '0x' + sign;
    }

    const msg = createSignMessage(getAddress(address), user.nonce);

    const addressFromSign = verifyMessage(toUtf8Bytes(msg), sign);

    if (getAddress(addressFromSign) !== getAddress(address))
      throw new HttpException('Invalid sign', HttpStatus.BAD_REQUEST);

    const payload: JwtPayload = {
      username: user.username,
      _id: user.id,
      address,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateSignMessage(address: string) {
    if (!isAddress(address))
      throw new HttpException('Invalid address', HttpStatus.BAD_REQUEST);

    let nonce = crypto.randomBytes(16).toString('base64');
    nonce = encodeBytes32String(nonce);

    await this.usersService.updateUserNonce(address, nonce);

    const msg = createSignMessage(getAddress(address), nonce);

    return msg;
  }

  async getUserFromJwtPayload({ _id }: JwtPayload) {
    const user = await this.usersService.findOne(_id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async isJwtTokenValid(token: string): Promise<JwtPayload | undefined> {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return;
    }
  }
}
