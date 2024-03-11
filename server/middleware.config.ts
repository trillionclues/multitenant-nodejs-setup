import { databaseResolver } from "../middleware/databaseResolver";

// configure the middleware to be used in our application.
export default function (app: any) {
  app.use(databaseResolver);
}
