/** @format */

import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
import { Auth0InstanceData, Auth0InstanceMethods, getInstance } from '@/auth0';
import { ApolloLink, from, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { OperationDefinitionNode } from 'graphql';
import { RetryLink } from '@/apollo/RetryLink';

const httpLink = createHttpLink({
    uri: 'http://localhost:9000/v1/graphql',
    credentials: 'include',
});

type Auth0Instance = Auth0InstanceData & Auth0InstanceMethods

const subscription = new WebSocketLink(
    new SubscriptionClient(
        'ws://localhost:9000/v1/graphql',
        {
            reconnect: true,
            lazy: true,
            /* eslint-disable */
            async connectionParams() {
                const instance: Auth0Instance = getInstance() as unknown as Auth0Instance;
                await instance.blockLoading();
                const token = await instance.getIdTokenClaims();
                return {
                    authToken: token.__raw,
                };
            },
            /* eslint-enable */
        },
    ),
);

const tokenContext = setContext(async () => {
    const instance: Auth0Instance = getInstance() as unknown as Auth0Instance;
    await instance.blockLoading();
    const token = await instance.getIdTokenClaims();
    const bearer = `Bearer ${token.__raw}`;
    await new Promise(r => setTimeout(r, 500));
    return {
        headers: {
            authorization: bearer,
        },
    };
});

const httpRetry = new RetryLink({
    willRetry: (count, _, error) => count > 10 ? false : /Could not verify JWT: JWTIssuedAtFuture/.test((error as { message: string }[])[0].message),
    delayFor: (count) => Math.floor(Math.random() * 50 * count),
});

const subscriptionRetry = new RetryLink({
    willRetry: (count, _, error) => count > 10 ? false : /Could not verify JWT: JWTIssuedAtFuture/.test((error as { message: string }[])[0].message),
    delayFor: (count) => Math.floor(Math.random() * 50 * count),
});


const connection: ApolloLink = split(
    (op) => op.query.definitions.some((v) => (v as OperationDefinitionNode).operation === 'subscription'),
    from([subscriptionRetry as unknown as ApolloLink, subscription as unknown as ApolloLink]),
    from([httpRetry as unknown as ApolloLink, tokenContext as unknown as ApolloLink, httpLink]),
);

const cache = new InMemoryCache();

const error = onError((error) => {
    console.error('[GraphQL]', error);
    return error.forward(error.operation);
});

const apolloClient = new ApolloClient({
    link: from([error as unknown as ApolloLink, connection]),
    cache,
    queryDeduplication: true,
});

Vue.use(VueApollo);

export const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
});
