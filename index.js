import { ApolloServer } from 'apollo-server'
import mongoose from 'mongoose';
import { MONGODB } from './config.js'
import {typeDefs} from './graphql/typeDefs.js'
import {resolvers} from './graphql/resolvers.js'

const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("Database working");
        return server.listen({ port: 5000 });
    }).then((res) => {
        console.log(`Server ready at ${res.url}`);
    }).catch
    ((err) => {
        console.log(err);
    });


