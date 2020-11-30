import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import * as nodemailer from "nodemailer"

import { UserService } from "./user.service"

import { User } from "./user.model"
import { AuthGuard } from "src/middleware/auth.gaurd"
import {
  RegisterDto,
  GetUserDto,
  LoginDto,
  UpdateUserDto,
  DeleteUserDto,
  ForgetPasswordDto,
  GetSMSTokenDto,
  SMSLoginDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from "./user.dto"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"

@ApiTags("User")
@ApiBearerAuth()
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/register")
  async createUser(
    @Body()
    reqBody: RegisterDto,
  ) {
    try {
      const user = await this.userService.createUser(reqBody)
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_SECRET,
      )
      //! To avoid password leakage
      user.password = undefined
      return { info: "User succesfully created!", user, token }
    } catch (err) {
      throw err
    }
  }

  @Post("/login")
  async login(@Body() reqBody: LoginDto) {
    try {
      const user: any = await this.userService.getUserByEmail(reqBody.email)
      const checkPassword = await bcrypt.compare(
        reqBody.password,
        user.password,
      )
      if (!checkPassword)
        //! Not to give unnecessary info
        throw new NotFoundException("Username or password is incorrect!")
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_SECRET,
      )
      user.password = undefined
      return { info: "Successfully logged in!", user, token }
    } catch (err) {
      throw err
    }
  }

  @Get("/users")
  async getUsers() {
    try {
      const users = await this.userService.getUsers()
      users.map(user => (user.password = undefined))
      return users
    } catch (err) {
      throw err
    }
  }

  @Post("/user")
  async getUser(@Body() reqBody: GetUserDto) {
    try {
      const user: any = await this.userService.getUser(reqBody.id)
      user.password = undefined
      return user
    } catch (err) {
      throw err
    }
  }

  @Post("/updateUser")
  @UseGuards(new AuthGuard())
  async updateUser(
    @Req() req,
    @Body()
    reqBody: UpdateUserDto,
  ) {
    try {
      if (!req.isAuth) throw new UnauthorizedException("You are not logged in!")
      if (
        req.decodedToken.id !== parseInt(reqBody.id) &&
        //! in case we want to add admin role later
        req.decodedToken.role !== "Admin"
      )
        throw new UnauthorizedException(
          "You are not authorized for this action!",
        )
      const user = await this.userService.getUser(reqBody.id)
      if (reqBody.phoneNumber) user.phoneNumber = reqBody.phoneNumber
      //! Password can only be changed by the user in change Password
      //? We can do it here if required!
      // if (reqBody.password)
      //   user.password = await bcrypt.hash(
      //     reqBody.password,
      //     parseInt(process.env.HASH_SALT),
      //   )
      await user.save()
      user.password = undefined
      return { info: "User succesfully added!", user }
    } catch (err) {
      throw err
    }
  }

  @Delete("/deleteUser")
  async deleteUser(
    @Body()
    reqBody: DeleteUserDto,
  ) {
    try {
      const user = await this.userService.deleteUser(reqBody.id)
      user.password = undefined
      return { info: "User succesfully added!", user }
    } catch (err) {
      throw err
    }
  }

  @Post("/forgetPassword")
  async forgetPassword(@Body() reqBody: ForgetPasswordDto) {
    try {
      const checkUser = await User.findOne({ where: { email: reqBody.email } })
      if (!checkUser)
        // this means a user does not exists
        return {
          info: "If user exists, a link will be provided to reset password",
        }
      //! expiration date should be lowered!
      const tempToken = jwt.sign(
        { userId: checkUser.id },
        process.env.TOKEN_SECRET,
        { expiresIn: "1d" },
      )

      // ! commment it out for development purposes as email does not go without VPN
      // todo Remember to reenable the email send in production
      // const testAccount = await nodemailer.createTestAccount()
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.ethereal.email",
      //   port: 587,
      //   secure: false, // true for 465, false for other ports
      //   auth: {
      //     user: testAccount.user, // generated ethereal user
      //     pass: testAccount.pass, // generated ethereal password
      //   },
      // })

      // // send mail with defined transport object
      // let info = await transporter.sendMail({
      //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
      //   to: "bar@example.com, baz@example.com", // list of receivers
      //   subject: "Hello ✔", // Subject line
      //   text: "Hello world?", // plain text body
      //   html: "<b>Hello world?</b>", // html body
      // })

      // console.log("Message sent: %s", info.messageId)
      // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // // Preview only available when sending through an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
      // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      // const urlPreview = nodemailer.getTestMessageUrl(info)
      // const response = urlPreview ? urlPreview : "urlPreview"

      //! tempToken is sent for development purposes only
      //Todo: make sure to remove it in production
      return {
        //! commented out cause we are not sending any email
        // response,
        info: "If user exists, a link will be provided to reset password",
        //! send for development, Remove temptoken in production
        tempToken,
      }
    } catch (err) {
      throw err
    }
  }

  @Post("/resetPassword")
  async resetPassword(@Req() req, @Body() reqBody: ResetPasswordDto) {
    try {
      const tokenVerify = jwt.verify(
        req.body.tempToken,
        process.env.TOKEN_SECRET,
      )
      console.log({ tokenVerify })
      if (!tokenVerify) throw new UnauthorizedException("Invalid Token")

      //* "as any" to fix typescript error for jwt.verify return
      const { userId } = tokenVerify as any
      const user = await User.findOne(userId)
      if (!user) throw new NotFoundException("User does not exist!")
      console.log({ user })
      user.password = await bcrypt.hash(
        req.body.newPassword,
        parseInt(process.env.HASH_SALT),
      )
      await user.save()
      // console.log({ newUser: user })
      user.password = undefined
      // console.log({ newUser: user })
      return user
    } catch (err) {
      throw err
    }
  }

  @Post("/changePassword")
  @UseGuards(new AuthGuard())
  async changePassword(@Req() req, @Body() reqBody: ChangePasswordDto) {
    try {
      if (!req.isAuth) throw new UnauthorizedException("You are not logged in!")
      const user = await User.findOne(req.decodedToken.id)

      //? I know, just to be sure
      if (!user) throw new NotFoundException("User does not exist!")
      user.password = await bcrypt.hash(
        req.body.newPassword,
        parseInt(process.env.HASH_SALT),
      )
      await user.save()
      user.password = undefined
      return { info: "Password successfully changed", user }
    } catch (err) {
      throw err
    }
  }

  @Post("/getSMStoken")
  async getSMStoken(@Req() req, @Body() reqBody: GetSMSTokenDto) {
    try {
      const result = await this.userService.getSMStoken(req.body.phoneNumber)
      return result
    } catch (err) {
      throw err
    }
  }

  @Post("/smsLogin")
  async smsLogin(@Req() req, @Body() reqBody: SMSLoginDto) {
    try {
      const result = await this.userService.smsLogin(req.body)
      return result
    } catch (err) {
      throw err
    }
  }
}
