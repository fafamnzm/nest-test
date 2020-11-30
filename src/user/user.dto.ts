import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class RegisterDto {
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty()
  phoneNumber: string

  // //! change to required for production
  // @ApiPropertyOptional()
  // firstName: string

  // @ApiPropertyOptional()
  // lastName: string
}

export class LoginDto {
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string
}

export class GetUserDto {
  @ApiProperty()
  id: string
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  id: string

  //* for changing email, they should create a new account
  // @ApiPropertyOptional()
  // email: string

  @ApiPropertyOptional()
  phoneNumber: string

  // //! change to required for production
  // @ApiPropertyOptional()
  // firstName: string

  // @ApiPropertyOptional()
  // lastName: string
}

export class DeleteUserDto {
  @ApiProperty()
  id: string
}

export class ForgetPasswordDto {
  @ApiProperty()
  email: string
}

export class ResetPasswordDto {
  @ApiProperty()
  tempToken: string

  @ApiProperty()
  newPassword: string
}

export class ChangePasswordDto {
  @ApiProperty()
  newPassword: string
}

export class GetSMSTokenDto {
  @ApiProperty()
  phoneNumber: string
}

export class SMSLoginDto {
  @ApiProperty()
  njdbId: string

  @ApiProperty()
  smsToken: string
}
