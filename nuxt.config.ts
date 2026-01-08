export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    regionAws: process.env.AWS_REGION,
    accessKeyIdAws: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKeyAws: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketAws: process.env.AWS_S3_BUCKET_NAME,
    jwtSecret: process.env.JWT_SECRET,
    pwdSecret: process.env.PWD_SECRET,
  }
})