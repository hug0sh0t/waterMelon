import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./MyContext";
import { verify } from "jsonwebtoken";


export const isAuthorized: MiddlewareFn<MyContext> = ({context}, next ) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error("No Authentication Credentsials");
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESSKEY_JWT!);
    context.payload = payload as any;
  } catch (errorSignal) {
    console.log(errorSignal);
    throw new Error("no Authenticated Access Allowed")
  }

  return next()
}