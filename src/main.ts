import "dotenv-safe/config"
import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"

import { AppModule } from "./app.module"
// import { UserModule } from './user/user.module';

const port = process.env.PORT || 3000

async function bootstrap() {
  //! Make sure to add the frontend URL to the origin array
  // todo DONT FORGET TO EDIT THE ORIGIN BEFORE DEPLOYING TO PRODUCTION
  const origin = ["*"] //? Allowed Urls!
  const app = await NestFactory.create(AppModule)

  // //? swagger setup
  const Options = new DocumentBuilder()
    .setTitle("Ava food")
    .setDescription("Ava food API description")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("User")
    .addTag("BlogPost")
    .build()
  const Document = SwaggerModule.createDocument(app, Options)
  SwaggerModule.setup("api", app, Document)

  //? To enable cors
  app.enableCors({ origin })

  //? start server
  await app.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}`),
  )
}
bootstrap()
