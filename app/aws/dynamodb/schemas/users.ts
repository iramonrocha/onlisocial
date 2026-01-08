import { item, number, string } from 'dynamodb-toolbox'

export const UsersSchema = item({
  id: string().key(),
  points: number(),
  username: string(),
  password: string()
})