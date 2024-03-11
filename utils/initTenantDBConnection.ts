import mongoose, { Connection, Model } from "mongoose";
import UserSchema from "../schema/users.model";
import { UsersDocument } from "../types/users.document";

const clientOption = {
  socketTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const initTenantDBConnection = async (DB_URL: string, dbName: any) => {
  try {
    const db: Connection = mongoose.createConnection(DB_URL, clientOption);
    db.on("error", (err: Error) =>
      console.log(`Tenant ${dbName} db error: `, err)
    );

    db.once("open", () => {
      console.log(`Tenant connection for ${dbName} MongoDB Connection ok!`);
    });

    const UserModel = db.model<UsersDocument>(
      "users",
      UserSchema.schema
    ) as Model<UsersDocument>;
    await UserModel.init();

    return db;
  } catch (error) {}
};

export { initTenantDBConnection };
