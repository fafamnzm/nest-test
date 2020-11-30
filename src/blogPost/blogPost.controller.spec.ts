import { Test, TestingModule } from "@nestjs/testing"
import { BlogPostController } from "./blogPost.controller"

import { BlogPost } from "./blogPost.model"
import { BlogPostService } from "./blogPost.service"

describe("BlogPostController", () => {
  let controller: BlogPostController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostController],
    }).compile()

    controller = module.get<BlogPostController>(BlogPostController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
