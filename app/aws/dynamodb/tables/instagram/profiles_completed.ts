import { Table } from 'dynamodb-toolbox'
import { getDynamoDBClient } from "@/aws/dynamodb/client"

export const ProfilesCompletedTable = new Table({
  name: '003_instagram_profiles_completed',
  partitionKey: {
    name: 'id',
    type: 'string'
  },
  documentClient: getDynamoDBClient()
})