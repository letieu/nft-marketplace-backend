import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../../global/base.model';
import { UserRoleEnum } from '../interfaces/userRole.enum';
import { UserStatusEnum } from '../interfaces/userStatus.enum';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends BaseModel {
  @Prop()
  username: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  email: string;

  @Prop()
  title: string;

  @Prop()
  status: UserStatusEnum;

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  @Prop()
  banner: string;

  @Prop()
  description: string;

  @Prop({ default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Prop({ default: true })
  isCreator: boolean;

  @Prop({ type: String, select: false })
  nonce: string;

  @Prop()
  website: string;

  @Prop()
  instagram: string;

  @Prop()
  twitter: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
