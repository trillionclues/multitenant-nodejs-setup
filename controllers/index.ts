import { Request, Response } from "express";
import { loginService } from "../services/auth";
import { addATenantService } from "../services/tenant";
import mongoose from "mongoose";

export async function loginController(
  req: Request,
  res: Response
): Promise<void> {
  const serviceFnResponse = await loginService(req.body);
  res.status(serviceFnResponse.statusCode).json({ ...serviceFnResponse });
}

export async function addATenantController(
  req: Request,
  res: Response
): Promise<void> {
  // Extract necessary data from the request body
  const { name, email, dbUri } = req.body;

  // Assuming you have access to a mongoose connection instance
  const dbConn: mongoose.Connection = mongoose.connection;

  try {
    const serviceFnResponse = await addATenantService(dbConn, {
      name,
      email,
      dbUri,
    });

    if (serviceFnResponse) {
      res.status(serviceFnResponse.statusCode).json({ ...serviceFnResponse });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
