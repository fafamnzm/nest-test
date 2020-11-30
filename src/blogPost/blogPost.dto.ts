import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateBlogPostDto {
  @ApiProperty()
  title: string

  @ApiProperty()
  content: string
}

//? We can make it to extend the createBlogPostDto
//? However some parts might be optional
// export class UpdateBlogPostDto extends CreateBlogPostDto {
export class UpdateBlogPostDto {
  @ApiProperty()
  id: string

  @ApiPropertyOptional()
  title: string

  @ApiPropertyOptional()
  content: string
}

export class GetBlogPostDto {
  @ApiProperty()
  id: string
}
