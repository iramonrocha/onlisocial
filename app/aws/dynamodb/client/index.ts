import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { getEnv } from "@/utils/getEnv"

let client: DynamoDBClient

export const getDynamoDBClient = (): DynamoDBClient => {
    if (!client) {
        client = new DynamoDBClient({
            region: getEnv("REGION_AWS", "private"),
            credentials: {
                accessKeyId: getEnv("ACCESS_KEY_ID_AWS", "private"),
                secretAccessKey: getEnv("SECRET_ACCESS_KEY_AWS", "private")
            }
        })
    }
    return client
}