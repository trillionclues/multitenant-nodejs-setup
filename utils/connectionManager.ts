import mongoose, { Connection, ObjectId } from "mongoose";
import { initAdminDbConnection } from "./initAdminDBConnection";
import { getATenantRepo, getTenantsRepo } from "../repositories/tenant";
import { initTenantDBConnection } from "./initTenantDBConnection";
import {
  getCacheConnection,
  getCacheValuesArr,
  setCacheConnection,
} from "./lruCacheManager";
import dotenv from "dotenv";
dotenv.config();

let adminDbConnection: Connection;

// This function will be called at the start
// of our server. Its purpose is to initialize the admin database
// and the database connections for all of the tenants.
export const connectAllDb = async (): Promise<void> => {
  const ADMIN_DB_URI: string = process.env.MONGODB_ADMIN_URI!;

  // if (!adminDbConnection) {
  adminDbConnection = await initAdminDbConnection(ADMIN_DB_URI);
  // }

  const allTenants = await getTenantsRepo(adminDbConnection, {
    name: 1,
    dbUri: 1,
    _id: 1,
  });

  for (const tenant of allTenants) {
    const tenantId = tenant._id as ObjectId;

    const tenantConnection = (await initTenantDBConnection(
      tenant.dbUri!,
      tenant.name
    )) as Connection;
    setCacheConnection(tenantId.toString(), tenantConnection);
  }
};

export const getConnectionForTenant = async (
  tenantId: string
): Promise<Connection | null> => {
  console.log(`Getting connection from cache for ${tenantId}`);
  let connection: Connection | undefined = getCacheConnection(tenantId);
  if (!connection) {
    console.log(`Connection cache miss for ${tenantId}`);

    const tenantData: any | null = await getATenantRepo(
      adminDbConnection,
      { _id: tenantId },
      { dbUri: 1, name: 1 }
    );

    if (tenantData) {
      connection = await initTenantDBConnection(
        tenantData.dbUri,
        tenantData.name
      );
      if (!connection) return null;

      console.log("Connection cache added for ", tenantData.name);
    } else {
      console.log("No connection data for tenant with ID", tenantId);
      return null;
    }
  }

  return connection;
};

export const getAdminConnection = (): Connection | undefined => {
  console.log("Getting adminDbConnection");
  return adminDbConnection;
};

const gracefulShutdown = async (): Promise<void> => {
  console.log("Closing all database connections...");

  const connectionArr: Connection[] = getCacheValuesArr();

  // Close all tenant database connections from the cache
  for (const connection of connectionArr) {
    await connection.close();
    console.log("Tenant database connection closed.");
  }

  // Close the admin database connection if it exists
  if (adminDbConnection) {
    await adminDbConnection.close();
    console.log("Admin database connection closed.");
  }

  console.log("All database connections closed. Yay!");
};

let isShutdownInProgress = false;

// Listen for termination signals
["SIGINT", "SIGTERM", "SIGQUIT", "SIGUSR2"].forEach((signal) => {
  process.on(signal, async () => {
    if (!isShutdownInProgress) {
      console.log(`Received ${signal}, gracefully shutting down...`);
      isShutdownInProgress = true;
      await gracefulShutdown();
      process.exit(0);
    }
  });
});
