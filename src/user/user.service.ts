import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"

import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { v4 } from "uuid"
import * as speakeasy from "speakeasy"

import { JsonDB } from "node-json-db"
import { Config } from "node-json-db/dist/lib/JsonDBConfig"

import { User } from "./user.model"
import { RegisterDto } from "./user.dto"

var njdb = new JsonDB(new Config("smsDB", true, true, "/"))
@Injectable()
export class UserService {
  async createUser(reqBody: RegisterDto) {
    const checkUser = await User.find({ where: { email: reqBody.email } })
    if (checkUser.length !== 0)
      throw new NotAcceptableException("User already exists!")
    const hashedPassword = await bcrypt.hash(
      reqBody.password,
      parseInt(process.env.HASH_SALT),
    )
    const user = User.create({
      email: reqBody.email,
      password: hashedPassword,
      phoneNumber: reqBody.phoneNumber,
    })
    await user.save()
    return user
  }

  async getUsers() {
    const users = await User.find()
    return users
  }

  async getUser(userId) {
    const user = await User.findOne(userId)
    if (!user) throw new NotFoundException("User does not exist!")
    return user
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ where: { email } })
    if (!user) throw new NotFoundException("User does not exist!")
    return user
  }

  async deleteUser(userId: any) {
    const user = await User.findOne(userId)
    if (!user) throw new NotFoundException("User does not exist!")
    await user.remove()
    return user
  }

  async getSMStoken(phoneNumber) {
    //todo: To add them to database and check for duplicates
    // const checkNUmber = await User.find({where:{phoneNumber:phoneNumber}})
    // if(checkNUmber.length!==0) throw new Exception
    if (!phoneNumber)
      throw new BadRequestException("phone number required and not provided")
    const user = await User.findOne({
      where: { phoneNumber },
    })
    if (!user) throw new ForbiddenException("You are not registered yet!")
    const njdbId = v4()
    const path = `/user/${njdbId}`
    const tempSecret = speakeasy.generateSecret()
    // console.log({F tempSecret })
    njdb.push(path, { njdbId, tempSecret, phoneNumber })
    const smsToken = speakeasy.totp({
      secret: tempSecret.base32,
      encoding: "base32",
    })
    //* send sms with smsToken in it!
    //! smsToken sent

    //! smsToken was returned for development purposes!! REMOVE before production
    return { njdbId, tempSecret, smsToken }
  }

  async smsLogin(reqBody) {
    const { njdbId, smsToken: token } = reqBody
    const path = `/user/${njdbId}`
    const njdbUser = njdb.getData(path)
    console.log({ njdbUser })
    const { base32: secret } = njdbUser.tempSecret
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    })
    if (verified) {
      const user = await User.findOne({
        where: { phoneNumber: njdbUser.phoneNumber },
      })
      if (!user) throw new ForbiddenException("You are not registered yet!")
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_SECRET,
      )
      //? Update user data
      njdb.delete(path)
      return { info: "Successfully logged in", token }
    } else {
      throw new UnauthorizedException("The entered code is incorrect!")
    }
    return true
  }
}
