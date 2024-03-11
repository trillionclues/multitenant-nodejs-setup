// project based on this article
// https://dev.to/rampa2510/guide-to-building-multi-tenant-architecture-in-nodejs-40og

/* other resources */
// https://dev.to/przpiw/nodejs-mongodb-multi-tenant-app-by-example-435n
// https://github.com/syook/node_mongo_multitenant/
// https://medium.com/geekculture/building-a-multi-tenant-app-with-nodejs-mongodb-ec9b5be6e737
// https://engrmaan.medium.com/implementation-of-multi-tenant-architecture-using-nodejs-mongodb-ae873bba594b
// ..................................... //

import ExpressConfig from "./server/express.config";
import MiddlewareConfig from "./server/middleware.config";
import RouteConfig from "./server/route.config";
import dotenv from "dotenv";
dotenv.config();

const app = ExpressConfig();

MiddlewareConfig(app);
RouteConfig(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Multi-tenant server running on port ${PORT}...`);
});
