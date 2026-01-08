export default defineEventHandler(() => {
    const config = useRuntimeConfig()

    return {
        awsRegion: config.regionAws,
        awsS3Bucket: config.s3BucketAws,
        accessKeyLength: config.accessKeyIdAws?.length ?? 0,
        secretKeyLength: config.secretAccessKeyAws?.length ?? 0
    }
})