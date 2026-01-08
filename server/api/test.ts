import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async () => {
    const config = useRuntimeConfig()

    try {
        const s3 = new S3Client({
            region: config.regionAws,
            credentials: {
                accessKeyId: config.accessKeyIdAws,
                secretAccessKey: config.secretAccessKeyAws
            }
        })

        const result = await s3.send(
            new ListObjectsV2Command({
                Bucket: config.s3BucketAws,
                MaxKeys: 1
            })
        )

        return {
            success: true,
            message: 'S3 OK',
            bucket: config.s3BucketAws,
            region: config.regionAws,
            objects: result.Contents?.length ?? 0
        }
    } catch (error: any) {
        console.error('AWS ERROR FULL:', error)

        return {
            success: false,
            name: error.name,
            message: error.message,
            code: error.$metadata?.httpStatusCode
        }
    }
})