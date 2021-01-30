import "reflect-metadata";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { BodyResolver } from './BodyResolver'
import { createConnection } from "typeorm";

// async lambda func 
(async () => {
    const app = express();
    app.get('/', (_req, res) => res.send('watermelon sugar HIGH'))
   
    await createConnection();

    const apolloServer =  new ApolloServer({
        schema: await buildSchema({
            resolvers: [BodyResolver]
        })
    });
    
    apolloServer.applyMiddleware({ app });

    app.listen(9000, () => {
        console.log("watermelon server at 9k")
    });
})();


