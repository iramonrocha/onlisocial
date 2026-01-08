import { Table } from 'dynamodb-toolbox'
import { getDynamoDBClient } from "@/aws/dynamodb/client"

export const UsernamesTable = new Table({
  name: '003_usernames',
  partitionKey: {
    name: 'id',
    type: 'string'
  },
  documentClient: getDynamoDBClient()
})