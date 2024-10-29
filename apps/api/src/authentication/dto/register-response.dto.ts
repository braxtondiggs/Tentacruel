import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Confirmation message for registration',
    example: 'User registered successfully.'
  })
  @Expose()
  message: string;

  constructor() {
    this.message = 'User registered successfully.';
  }
}
