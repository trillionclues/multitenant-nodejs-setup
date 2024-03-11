import mongoose from "mongoose";

const mainSchemaName = "tenantUsers";

// This function is part of a service
// with transactions.
const addATenantUserRepo = async (
  dbConn: mongoose.Connection,
  tenantUserData: any,
  session = null
) => {
  const sessionOption = session ? { session } : {};
  if (session) {
    sessionOption.session = session;
  }

  const data = await dbConn
    .model(mainSchemaName)
    .create([tenantUserData], sessionOption);

  return data[0];
};

const getATenantUserRepo = async (
  dbConn: mongoose.Connection,
  findQuery: mongoose.FilterQuery<any> | undefined,
  selectQuery = {}
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .findOne(findQuery)
    .select(selectQuery)
    .lean();

  return data;
};

const updateATenantUserRepo = async (
  dbConn: mongoose.Connection,
  findQuery: mongoose.FilterQuery<any> | undefined,
  updateQuery: any
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .updateOne(findQuery, updateQuery);
  return data;
};

export { addATenantUserRepo, getATenantUserRepo, updateATenantUserRepo };
