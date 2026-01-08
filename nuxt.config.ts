export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    awsRegion: process.env.REGION_AWS,
    awsAccessKeyId: process.env.ACCESS_KEY_ID_AWS,
    awsSecretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
    awsS3Bucket: process.env.S3_BUCKET_NAME_AWS,
    jwtSecret: process.env.JWT_SECRET,
    jpwSecret: process.env.PWD_SECRET
  }
})