import mongoose from "mongoose";

const mainSchemaName = "users";

// This function is part of the service
// with transactions.
const addAUserRepo = async (
  dbConn: mongoose.Connection,
  userData: any,
  session = null
) => {
  const sessionOption = session ? { session } : {};
  if (session) sessionOption.session = session;
  const data = await dbConn
    .model(mainSchemaName)
    .create([userData], sessionOption);
  return data[0];
};

const getAUserRepo = async (
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

const updateUserRepo = async (
  dbConn: mongoose.Connection,
  findQuery: mongoose.FilterQuery<any> | undefined,
  updateQuery: any
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .updateOne(findQuery, updateQuery);
  return data;
};

const getUsersRepo = async (
  dbConn: mongoose.Connection,
  findQuery = {},
  selectQuery = {}
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .find(findQuery)
    .select(selectQuery)
    .lean();

  return data;
};

export { addAUserRepo, getAUserRepo, updateUserRepo, getUsersRepo };
