/** @format */

import gql from 'graphql-tag';

export const typeDefs = gql`
    scalar DateTime

    type User {
        user_id: ID!
        created_at: DateTime!
        updated_at: DateTime!
        email: String!
        name: String!
        nickname: String!
        picture: String!
    }

    type Query {
        user(id: String!): User
        users(name: String): [User]!
    }
`;
