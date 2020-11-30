import { Module } from "@nestjs/common"
import { BlogPostController } from "./blogPost.controller"
import { BlogPostService } from "./blogPost.service"

@Module({
  controllers: [BlogPostController],
  providers: [BlogPostService],
})
export class BLogPostModule {}
