import { Schema, model } from "mongoose";
import { TenantDocument } from "../types/tenant.document";

const tenantSchema = new Schema({
  dbUri: { type: String, required: true },
  name: { type: String, unique: true, required: true },
});

export default model<TenantDocument>("Tenants", tenantSchema);
