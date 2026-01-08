export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    awsRegion: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: process.env.AWS_S3_BUCKET_NAME,
    jwtSecret: process.env.JWT_SECRET,
    pwdSecret: process.env.PWD_SECRET,
  }
})