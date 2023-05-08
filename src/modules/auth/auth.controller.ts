import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginWalletDto } from '../user/dtos/login-wallet.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auth.decorator';
import { JwtAuthGuard } from './guard/jwt.guard';
import { JwtPayload } from './types/jwtPayload.type';
import { GetNonceDto } from '../user/dtos/get-nonce.dto';

@ApiBearerAuth()
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/nonce')
  async getNonce(@Body() payload: GetNonceDto) {
    return await this.service.generateSignMessage(payload.address);
  }

  @Post('wallet_login')
  async loginByWallet(@Body() loginDto: LoginWalletDto) {
    return await this.service.genTokenFromSign(loginDto.address, loginDto.sign);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async me(@Auth() auth: JwtPayload) {
    return await this.service.getUserFromJwtPayload(auth);
  }
}
