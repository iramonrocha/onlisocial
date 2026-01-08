import { Entity, ScanCommand } from 'dynamodb-toolbox'

export const scan = async (entity: Entity, options: any = {}): Promise<any> => {
  const queryCommand = entity.table.build(ScanCommand).entities(entity).options(options)
  const result = await queryCommand.send()
  return result
}