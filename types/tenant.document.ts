import { Schema, Document } from "mongoose";

export interface TenantDocument extends Document {
  dbUri: string;
  name: string;
}
