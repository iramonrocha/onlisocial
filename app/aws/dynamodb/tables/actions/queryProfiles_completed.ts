import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { getDynamoDBClient } from "@/aws/dynamodb/client"

const client = getDynamoDBClient()

export const queryUser_id = async (user_id: string) => {
    const params = {
        TableName: "003_instagram_profiles_completed",
        IndexName: "profiles_completed-index",
        KeyConditionExpression: "#user_id = :user_id",
        ExpressionAttributeNames: { "#user_id": "user_id" },
        ExpressionAttributeValues: { ":user_id": user_id },
    }

    const command = new QueryCommand(params)
    const response = await client.send(command)

    if (!response.Items || response.Items.length === 0) return null

    return response.Items
}