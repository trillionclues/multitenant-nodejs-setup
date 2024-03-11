import { Schema, Types, model } from "mongoose";
import { TenantUserDocument } from "../types/tenantUser.document";

const tenantUserSchema = new Schema({
  email: String,
  tenantId: {
    type: Types.ObjectId,
    ref: "tenants",
  },
});
export default model<TenantUserDocument>("TenantUsers", tenantUserSchema);
