import mongoose, { Connection, Error, Model, Document } from "mongoose";
import { TenantDocument } from "../types/tenant.document";
import { TenantUserDocument } from "../types/tenantUser.document";
import TenantSchema from "../schema/tenant.model";
import TenantUserSchema from "../schema/tenantUser.model";

const clientOption = {
  socketTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Log MongoDB queries
mongoose.set("debug", true);

const initAdminDbConnection = async (DB_URL: any): Promise<Connection> => {
  try {
    const db: Connection = mongoose.createConnection(DB_URL, clientOption);

    db.on("error", (err: Error) => console.log("Admin db error: ", err));

    db.on("open", () => {
      console.log("Admin client MongoDB Connection ok!");
    });

    const TenantModel = db.model<TenantDocument>(
      "Tenant",
      TenantSchema.schema
    ) as Model<TenantDocument>;
    await TenantModel.init();

    const TenantUserModel = db.model<TenantUserDocument>(
      "TenantUser",
      TenantUserSchema.schema
    ) as Model<TenantUserDocument>;
    await TenantUserModel.init();

    return db;
  } catch (error) {
    console.error("Error initializing admin DB connection:", error);
    throw error;
  }
};

export { initAdminDbConnection };
