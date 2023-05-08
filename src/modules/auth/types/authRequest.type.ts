import { Request as HttpRequest } from 'express';
import { JwtPayload } from './jwtPayload.type';

export type AuthRequest = HttpRequest & { user: JwtPayload };
