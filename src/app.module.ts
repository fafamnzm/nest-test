import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { Connection } from "typeorm"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserModule } from "./user/user.module"

import { User } from "./user/user.model"
import { BlogPost } from "./blogPost/blogPost.model"
import { BLogPostModule } from "./blogPost/blogPost.module"

require("reflect-metadata")
//! not required, since we have dotenv-safe inserted in main.ts
// require("dotenv").config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      database: "nest-test",
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      logging: true,
      synchronize: true,
      entities: [User, BlogPost],
    }),
    UserModule,
    BLogPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
