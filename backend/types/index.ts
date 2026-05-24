import { Request } from "express";

export interface CustomRequest extends Request {
  imageUrl?: string;
  imageFileId?: string;
}
