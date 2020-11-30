import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    req.isAuth = false
    req.decodedToken = {}
    if (!req.headers.authorization) return true
    try {
      const token = req.headers.authorization.split(" ")[1]
      if (!token) return true
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
      // console.log({ decodedToken })
      if (!decodedToken) return true
      req.isAuth = true
      req.decodedToken = decodedToken
      return true
    } catch (err) {
      throw err
    }
  }
}
