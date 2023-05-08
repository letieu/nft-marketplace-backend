import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNftDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tokenId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tokenAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  txHash: string;
}
