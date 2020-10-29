import { IFieldResolver, IResolvers } from 'apollo-server';
import { Auth0ManagementAPI } from './management-api';

interface Context {
    management: Auth0ManagementAPI;
}

interface Resolvers extends IResolvers<unknown, Context> {
    Query: {
        user: IFieldResolver<unknown, Context, { id: string }>
        users: IFieldResolver<unknown, Context, { name?: string }>
    }
}

export const resolvers: Resolvers = {
    Query: {
        user: async (_, { id }, { management }) => {
            return await management.getUser(id);
        },
        users: async (_, { name }, { management }) => {
            return await management.getUsers(name);
        },
    },
};