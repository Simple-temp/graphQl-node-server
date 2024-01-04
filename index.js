import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled

} from "apollo-server-core";
//graphqlSchema
import typeDefs from "./schemaGql.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express from 'express';
import http from 'http';
import path from "path"
dotenv.config()


// const __dirname = path.resolve()
const port = process.env.PORT || 4000
const app = express();
const httpServer = http.createServer(app);


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log("db connected")
    })
    .catch((err) => {
        console.log(err)
    })

//mongoose models
import "./models/UserModel.js"
import "./models/PostModel.js"
//graphql resolvers
import resolvers from "./resolvers.js";

const context = ({ req }) => {

    const { authorization } = req.headers
    if (authorization) {
        const { userId } = jwt.verify(authorization, process.env.JWT_TOKEN)
        return { userId }
    }

}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        process.env.NODE_ENV !== "production" ?
            ApolloServerPluginLandingPageGraphQLPlayground() :
            ApolloServerPluginLandingPageDisabled
    ]
})

// app.use(express.static("../merng-client/build"))
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../merng-client/build/index.html"))
// })

app.get("/",(req, res)=>{
    res.send("It's work")
})

await server.start();
server.applyMiddleware({
    app,
    path: "/graphql"
});

httpServer.listen({ port }, () => {
    console.log(`🚀  Server ready at ${server.graphqlPath}`);
})
