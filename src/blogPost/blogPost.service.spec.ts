import { Test, TestingModule } from "@nestjs/testing"
import { BlogPostService } from "./blogPost.service"

import { User } from "src/user/user.model"
import { BlogPost } from "./blogPost.model"

describe("BlogPostService", () => {
  let service: BlogPostService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogPostService],
    }).compile()

    service = module.get<BlogPostService>(BlogPostService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
