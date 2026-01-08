import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { getEnv } from "@/utils/getEnv"

let client: DynamoDBClient

export const getDynamoDBClient = (): DynamoDBClient => {
    if (!client) {
        client = new DynamoDBClient({
            region: getEnv("AWS_REGION", "private"),
            credentials: {
                accessKeyId: getEnv("AWS_ACCESS_KEY_ID", "private"),
                secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY", "private")
            }
        })
    }
    return client
}