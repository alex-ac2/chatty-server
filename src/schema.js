const { buildSchema } = require('graphql');

let schema = buildSchema(`
  type Query {
    hello: String,
    userCount: Int,
    onlineCount2: Int
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

`);

module.exports = schema;