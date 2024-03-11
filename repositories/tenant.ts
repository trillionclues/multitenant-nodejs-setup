import mongoose from "mongoose";

const mainSchemaName = "tenants";

const getTenantsRepo = async (
  adminDbConnection: mongoose.Connection,
  findQuery = {},
  selectQuery = {}
) => {
  const data = await adminDbConnection
    .model(mainSchemaName)
    .find(findQuery)
    .select(selectQuery)
    .lean();
  return data;
};

const getATenantRepo = async (
  adminDbConnection: mongoose.Connection,
  findQuery = {},
  selectQuery = {}
) => {
  const data = await adminDbConnection
    .model(mainSchemaName)
    .findOne(findQuery)
    .select(selectQuery)
    .lean();
  return data;
};

// This function is part of a service
// that involves many database calls,
// so we'll use transactions here.
const addTenantRepo = async (
  adminDbConnection: mongoose.Connection,
  tenantData: any,
  session = null
) => {
  const sessionOption = session ? { session } : {};
  if (session) sessionOption.session = session;

  const data = await adminDbConnection
    .model(mainSchemaName)
    .create([tenantData], sessionOption);

  return data[0];
};

const updateATenant = async (
  adminDbConnection: mongoose.Connection,
  findQuery = {},
  selectQuery = {}
) => {
  const data = await adminDbConnection
    .model(mainSchemaName)
    .updateOne(findQuery, selectQuery);

  return data;
};

export { getTenantsRepo, getATenantRepo, addTenantRepo, updateATenant };
