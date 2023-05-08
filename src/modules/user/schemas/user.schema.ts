import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../../global/base.model';
import { UserRoleEnum } from '../types/userRole.enum';
import { UserStatusEnum } from '../types/userStatus.enum';
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

  @Prop({ type: String, select: false })
  nonce: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
