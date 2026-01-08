export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    AWS_REGION: process.env.REGION_AWS,
    AWS_ACCESS_KEY_ID: process.env.ACCESS_KEY_ID_AWS,
    AWS_SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY_AWS,
    AWS_S3_BUCKET_NAME: process.env.S3_BUCKET_NAME_AWS,
    JWT_SECRET: process.env.JWT_SECRET,
    PWD_SECRET: process.env.PWD_SECRET,
    public: {
      AWS_REGION: process.env.REGION_AWS
    }
  }
})