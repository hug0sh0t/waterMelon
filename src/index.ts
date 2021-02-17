import "dotenv/config";
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { BodyResolver } from './BodyResolver'
import { createConnection } from "typeorm";
import cookieParser from 'cookie-parser';
import { verify } from "jsonwebtoken";

// async lambda func 
(async () => {
    const app = express();
    app.use(cookieParser())
    app.get('/', (_req, res) => res.send('watermelon sugar HIGH'));
    
    app.post("/refresh_token", (req, res) => { // refresh route
      const token = req.cookies.jid
 
      if (!token) {
        return res.send({ od: false, accessToken: '' })
      }

      let payload = null;
      try {
        const payload = verify(token, process.env.REFRESH_JWT_KEY!);
      } catch (errorSignal) {
        console.log(errorSignal);
        return res.send({ od: false, accessToken: '' })
      }
        // jwt is cleared, and a token is sent 

    });

    await createConnection();

    const apolloServer =  new ApolloServer({
        schema: await buildSchema({
            resolvers: [BodyResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    });
    
    apolloServer.applyMiddleware({ app });

    app.listen(9000, () => {
        console.log("watermelon server at 9k")
    });
})();


