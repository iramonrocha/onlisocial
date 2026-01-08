import { Entity, UpdateItemCommand } from 'dynamodb-toolbox'

export const updateItem = async (entity: Entity, data: any, options = {}) => {
  await entity.build(UpdateItemCommand).item(data).options(options).send()
}