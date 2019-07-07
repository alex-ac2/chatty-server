const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello(name: String): String,
    userCount: Int,
    onlineCount2: Int,
    numOfUser: Int
    user: User
    newUser: User!
  }
  type NumOfUser {
    count: Int
  }
  type User {
    id: ID!,
    username: String!
    firstLetterOfUsername: String!
  }
  type Error {
    field: String!
    message: String!
  }
  type RegisterReponse {
    errors: [Error]
    user: User!
  }
  input UserInfo {
    username: String!
    password: String!
    age: Int
  }
  type Mutation {
    register(userInfo: UserInfo): RegisterReponse!
    login(userInfo: UserInfo): String!
    updateNum(count: Int): Int
  }
  type Subscription {
    newUser: User!
    numOfUser: Int
    commentAdded(repoFullName: String!): Comment
    somethingChanged: Result
  }
  type Comment {
    id: String,
    content: String
  }
  type Result {
    count: Int
  }
`;

module.exports = typeDefs;