import { IsUUID } from 'class-validator';

export default class FindOneParams {
  @IsUUID()
  id: string;
}
