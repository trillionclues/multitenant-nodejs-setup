import { Request, Response, NextFunction } from "express";
import { getConnectionForTenant } from "../utils/connectionManager";
import { verifyJWT } from "../utils/misc";

// Extend the Express module to include custom properties in the Request object
declare module "express-serve-static-core" {
  interface Request {
    dbConnection?: any;
  }
}

// The basic middleware logic that resolves the appropriate database
// connection based on the request's tenant information.
// The middleware also skips this process for the login route.

export const databaseResolver = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const urlArr: string[] = req.url.split("/");

  // Skip database resolution for login route
  if (urlArr.includes("login")) return next();

  const token: string | undefined = req.headers.jwt?.toString();
  if (!token) {
    return next();
  }

  try {
    // Handle the logic for null checking and authorization
    const payloadData: any = verifyJWT(token);
    if (!payloadData || !payloadData.tenantId) {
      return next();
    }

    // Handle the expiry logic, etc.
    const dbConnection = getConnectionForTenant(payloadData.tenantId);

    // Assign the dbConnection to the custom property 'dbConnection' of the Request object
    req.dbConnection = dbConnection;
    next();
  } catch (error) {
    console.error("Error in databaseResolver:", error);
    next(error);
  }
};
