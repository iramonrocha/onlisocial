export default defineEventHandler(() => {
  const config = useRuntimeConfig()

  return {
    awsRegion: config.awsRegion,
    awsS3Bucket: config.awsS3Bucket,
    accessKeyLength: config.awsAccessKeyId?.length ?? 0,
    secretKeyLength: config.awsSecretAccessKey?.length ?? 0
  }
})