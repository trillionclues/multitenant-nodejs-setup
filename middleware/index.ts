import cors from "cors";
import cookieParser from "cookie-parser";
import { Application } from "express";

export default function (app: Application) {
  app.use(cookieParser());
}
