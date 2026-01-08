import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3'

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

    // Testa se o bucket existe e se tem permissão
    await s3.send(
      new HeadBucketCommand({
        Bucket: config.awsS3Bucket
      })
    )

    return {
      success: true,
      message: 'Acesso à AWS S3 funcionando corretamente 🚀'
    }
  } catch (error: any) {
    console.error('Erro AWS:', error)

    return {
      success: false,
      message: 'Erro ao acessar AWS S3',
      error: error.message
    }
  }
})