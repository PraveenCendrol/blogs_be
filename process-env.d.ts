export interface ENV {
  MONGO_DB_URL: string;
  MONGO_DB_PASSWORD: string;
  NODE_ENV: string;
  ENVIRONMENT: string;
  JWT_EXPIRES_IN: string;
  JWT_SECRET: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_ACCESS_KEY: string;
  CLOUDFARE_ENDPOINT: string;
  R2_ACCOUNT_ID: String;
  R2_BUCKET_NAME: String;
}

declare namespace NodeJS {
  ENV;
}

export {};
