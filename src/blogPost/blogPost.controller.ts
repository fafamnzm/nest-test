import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { AuthGuard } from "../middleware/auth.gaurd"
import {
  CreateBlogPostDto,
  GetBlogPostDto,
  UpdateBlogPostDto,
} from "./blogPost.dto"
import { BlogPost } from "./blogPost.model"
import { BlogPostService } from "./blogPost.service"

@ApiTags("BlogPost")
@ApiBearerAuth()
@Controller("blogPost")
export class BlogPostController {
  constructor(private blogPostService: BlogPostService) {}

  @Post("/createBlogPost")
  @UseGuards(new AuthGuard())
  async createBlogPost(@Req() req, @Body() reqBody: CreateBlogPostDto) {
    try {
      //! Authorization check part
      //! if(user.role!== "") throw new UnauthorizedAccess()
      const checkBlogPost = await this.blogPostService.getBlogPostByTitle(
        reqBody.title,
      )
      if (checkBlogPost)
        throw new BadRequestException("BlogPost Already exists!")

      const user = req.decodedToken
        ? await this.blogPostService.getUser(req.decodedToken.id)
        : undefined

      if (!user) throw new BadRequestException("You are not logged in!!")

      const blogPost = new BlogPost()
      blogPost.title = reqBody.title
      blogPost.content = reqBody.content
      blogPost.user = user
      blogPost.createdBy = user.id
      // blogPost.updatedBy = [...user.id]
      await blogPost.save()
      user.password = undefined
      return blogPost
    } catch (err) {
      // throw new BadRequestException(err)
      throw err
    }
  }

  @Get("/blogPosts")
  async getBlogPosts() {
    try {
      return this.blogPostService.getBlogPosts()
    } catch (err) {
      console.log(err)
      // throw new NotFoundException(err)
      throw err
    }
  }

  @Post("/blogPost")
  async getBlogPost(@Body() reqBody: GetBlogPostDto) {
    try {
      const blogPost = await this.blogPostService.getBlogPost(reqBody)
      return blogPost
    } catch (err) {
      console.log(err)
      // throw new NotFoundException(err)
      throw err
    }
  }
  @UseGuards(new AuthGuard())
  @Put("/updateBlogPost")
  async updateBlogPost(@Req() req, @Body() reqBody: UpdateBlogPostDto) {
    try {
      //? check for duplicate titles like create
      const checkBlogPost = await this.blogPostService.getBlogPostByTitle(
        reqBody.title,
      )
      if (checkBlogPost)
        throw new BadRequestException("BlogPost Already exists!")

      //? check to see whether the blogPost exists!
      let blogPost = await this.blogPostService.getBlogPost(reqBody)
      if (!blogPost) throw new NotFoundException("No blogPost was found!")
      console.log({ token: req.decodedToken })

      const user = req.decodedToken
        ? await this.blogPostService.getUser(req.decodedToken.id)
        : undefined
      //! Authorization check part
      //! if(user.role!== "") throw new UnauthorizedAccess()

      if (reqBody.title) blogPost.title = reqBody.title
      if (reqBody.content) blogPost.content = reqBody.content

      await blogPost.save()
      return blogPost
    } catch (err) {
      console.log(err)
      // throw new NotFoundException(err)
      throw err
    }
  }

  @UseGuards(new AuthGuard())
  @Delete("/deleteBlogPost")
  async deleteBlogPost(@Req() req, @Body() reqBody: GetBlogPostDto) {
    try {
      const checkBlogPost = await this.blogPostService.getBlogPost(reqBody)
      if (!checkBlogPost)
        throw new NotFoundException("BlogPost does not exist!")

      const user = req.decodedToken
        ? await this.blogPostService.getUser(req.decodedToken.id)
        : undefined
      //! Authorization check part
      //! if(user.role!== "") throw new UnauthorizedAccess()

      const blogPost = await this.blogPostService.deleteBlogPost(reqBody)
      return blogPost
    } catch (err) {
      console.log(err)
      // throw new NotFoundException(err)
      throw err
    }
  }
}
