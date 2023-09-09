const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
    ENV_FILE_NAME = ".env";
    break;
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS;

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS;
const DATABASE_TYPE = process.env.DATABASE_TYPE;
const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  // To enable the admin plugin, uncomment the following lines and run `yarn add @medusajs/admin`
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
    },
  },
  {
    resolve: "medusa-plugin-printful",
    options: {
      printfulAccessToken: process.env.PRINTFUL_ACCESS_TOKEN,
      storeId: process.env.PRINTFUL_STORE_ID,
      backendUrl: process.env.BACKEND_URL,
      enableWebhooks: true,
      enableSync: true,
      batchSize: 3,
      productTags: true,
      productCategories: true,
      redisURL: REDIS_URL,
      confirmOrder: true,
    },
  },
  {
    resolve: `@medusajs/file-local`,
    options: {
      BACKEND_URL: "http://localhost:9000",
      upload_dir: "uploads",
    },
  },
];

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  database_type: DATABASE_TYPE,
  store_cors: STORE_CORS,
  admin_cors: ADMIN_CORS,
  redis_url: REDIS_URL,
  database_logging: ["error"],
};

if (DATABASE_URL && DATABASE_TYPE === "postgres") {
  projectConfig.database_url = DATABASE_URL;
  delete projectConfig["database_database"];
}

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
