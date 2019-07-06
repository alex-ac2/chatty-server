const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String,
    userCount: Int,
    onlineCount2: Int,
    numOfUser: Int
  }
  type Subscription {
    numOfUser: Int,
    commentAdded(repoFullName: String!): Comment,
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