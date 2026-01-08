import { Table } from 'dynamodb-toolbox'
import { getDynamoDBClient } from "@/aws/dynamodb/client"

export const ProfilesTable = new Table({
  name: '003_instagram_profiles',
  partitionKey: {
    name: 'id',
    type: 'string'
  },
  documentClient: getDynamoDBClient()
})