import mongoose from "mongoose";
import { addATenantUserRepo } from "../repositories/tenantUser";
import { addTenantRepo } from "../repositories/tenant";
import { setCacheConnection } from "../utils/lruCacheManager";
import { addAUserRepo } from "../repositories/user";
import { initAdminDbConnection } from "../utils/initAdminDBConnection";
import { initTenantDBConnection } from "../utils/initTenantDBConnection";

const addATenantService = async (
  dbConn: mongoose.Connection,
  tenantData: {
    name: string;
    email: string;
    dbUri: string;
  }
) => {
  const session = await dbConn.startSession();
  session.startTransaction();

  try {
    const data = await addTenantRepo(dbConn, { ...tenantData }, session as any);

    let userData;

    if (data._id) {
      userData = await addATenantUserRepo(
        dbConn,
        {
          tenantId: data._id,
          email: tenantData.email,
        },
        session as any
      );

      const tenantDbConnection = await initTenantDBConnection(
        data.dbUri,
        data.name
      );

      if (tenantDbConnection) {
        await addAUserRepo(
          tenantDbConnection,
          {
            _id: userData._id,
            email: tenantData.email,
          },
          session as any
        );
      }

      await session.commitTransaction();
      session.endSession();

      if (tenantDbConnection) {
        setCacheConnection(data._id.toString(), tenantDbConnection);
      }

      return {
        success: true,
        statusCode: 201,
        message: `Tenant added successfully`,
        responseObject: { tenantId: data._id, userId: userData?._id },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export { addATenantService };
