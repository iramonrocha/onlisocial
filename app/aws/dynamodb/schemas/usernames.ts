import { item, number, string } from 'dynamodb-toolbox'

export const UsernamesSchema = item({
  id: string().key(),
  username: string()
})