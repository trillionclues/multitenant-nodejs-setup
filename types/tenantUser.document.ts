import { Document, Types } from "mongoose";

export interface TenantUserDocument extends Document {
  email: string;
  tenantId: Types.ObjectId;
}
