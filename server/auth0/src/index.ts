/** @format */

import { ApolloServer } from 'apollo-server-express';
import express from 'express';

import { Auth0ManagementAPI } from './management-api';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

const app = express();

const schemaServer = new ApolloServer({
    typeDefs,
// @ts-ignore
    resolvers,
    context: (original: any) => {
        return {
            ...original,
            user: original.user || null,
            headers: original.req.headers || {},
            management: new Auth0ManagementAPI(),
        };
    },
});

schemaServer.applyMiddleware({ app });

const port = Number.parseInt(process.env.PORT || '4000');
const hostname = process.env.HOSTNAME || 'localhost';

app.listen(port, hostname, undefined, () => {
    console.log(`schema ready at http://${hostname}:${port}`);
});
