import { Table } from 'dynamodb-toolbox'
import { getDynamoDBClient } from "@/aws/dynamodb/client"

export const UsersTable = new Table({
  name: '003_users',
  partitionKey: {
    name: 'id',
    type: 'string'
  },
  documentClient: getDynamoDBClient()
})