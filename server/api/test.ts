import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async () => {
    const config = useRuntimeConfig()

    try {
        const s3 = new S3Client({
            region: config.awsRegion,
            credentials: {
                accessKeyId: config.awsAccessKeyId,
                secretAccessKey: config.awsSecretAccessKey
            }
        })

        const result = await s3.send(
            new ListObjectsV2Command({
                Bucket: config.awsS3Bucket,
                MaxKeys: 1
            })
        )

        return {
            success: true,
            message: 'S3 OK',
            bucket: config.awsS3Bucket,
            region: config.awsRegion,
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