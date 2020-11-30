import { Injectable } from "@nestjs/common"
import { User } from "src/user/user.model"
import { BlogPost } from "./blogPost.model"

@Injectable()
export class BlogPostService {
  async getUser(userId) {
    return User.findOne(userId)
  }

  async getBlogPostByTitle(blogPostTitle) {
    const checkBlogPost = await BlogPost.findOne({
      where: { title: blogPostTitle },
    })
    return checkBlogPost
  }

  async getBlogPosts() {
    //* if we want to have relations filled
    // return BlogPost.find({ relations: ["menus"] })
    return BlogPost.find()
  }

  async getBlogPost(reqBody) {
    return BlogPost.findOne(reqBody.id)
    // if (reqBody.name) return BlogPost.findOne({ where: { name: reqBody.name } })
    // if (reqBody.id) return BlogPost.findOne(reqBody.id)
  }

  async deleteBlogPost(reqBody) {
    return BlogPost.delete(reqBody.id)
    // if (reqBody.id) return BlogPost.delete(reqBody.id)
    // if (reqBody.name) return BlogPost.delete({ name: reqBody.name })
  }
}
