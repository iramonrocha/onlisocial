import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { getDynamoDBClient } from "@/aws/dynamodb/client"

const client = getDynamoDBClient()

export const queryUserByUsernames = async (username: string) => {
    const params = {
        TableName: "003_usernames",
        IndexName: "username-index",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: { "#username": "username" },
        ExpressionAttributeValues: { ":username": username },
        Limit: 1
    }

    const command = new QueryCommand(params)
    const response = await client.send(command)

    if (!response.Items || response.Items.length === 0) return null

    return response.Items[0]
}