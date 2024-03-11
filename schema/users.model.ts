import { Schema, model } from "mongoose";
import { UsersDocument } from "../types/users.document";

const usersSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String },
});
export default model<UsersDocument>("Users", usersSchema);
