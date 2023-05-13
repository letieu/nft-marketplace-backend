import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @ApiProperty()
  sellerAddress: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsString()
  @ApiProperty()
  tokenId: string;

  @IsString()
  @ApiProperty()
  tokenAddress: string;

  @IsString()
  @ApiProperty()
  signature: string;
}
