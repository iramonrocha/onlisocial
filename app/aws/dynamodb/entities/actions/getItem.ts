import { Entity, GetItemCommand } from 'dynamodb-toolbox'

export const getItem = async (entity: Entity, data: any): Promise<any> => {
  const result = await entity.build(GetItemCommand).key(data).send()
  return result
}