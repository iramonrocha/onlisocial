import { Entity, DeleteItemCommand } from 'dynamodb-toolbox'

export const deleteItem = async (entity: Entity, key: any, options = {}) => {
  await entity.build(DeleteItemCommand).key(key).options(options).send()
}