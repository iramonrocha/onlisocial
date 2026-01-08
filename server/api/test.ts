import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async () => {
    const config = useRuntimeConfig()

    try {
        const s3 = new S3Client({
            region: config.AWS_REGION,
            credentials: {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY
            }
        })

        const result = await s3.send(
            new ListObjectsV2Command({
                Bucket: config.AWS_S3_BUCKET_NAME,
                MaxKeys: 1
            })
        )

        return {
            success: true,
            message: 'S3 OK',
            bucket: config.AWS_S3_BUCKET_NAME,
            region: config.AWS_REGION,
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