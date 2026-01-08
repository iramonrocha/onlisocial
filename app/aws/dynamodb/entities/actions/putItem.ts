import { Entity, PutItemCommand } from 'dynamodb-toolbox'

export const putItem = async (entity: Entity, data: any, options = {}) => {
  await entity.build(PutItemCommand).item(data).options(options).send()
}