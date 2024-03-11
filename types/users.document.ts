import { Document } from "mongoose";

export interface UsersDocument extends Document {
  email: string;
  password: string;
}
