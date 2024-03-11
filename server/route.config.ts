// This file sets up the application's routes

import router from "../routes";

export default function (app: any) {
  app.use("/api", router);
}
