const resolvers = {
  Query: {
    hello: () => 'hello world',
    userCount: () => 2,
    numOfUser: () => 9,
  },
  Subscription: {
    numOfUser: () => 2
  }
  // Subscription: {
  //   numOfUser: {
  //     subscribe: () => pubsub.asyncIterator(USER_COUNT_CHANGED)
  //   }
  // },

}

module.exports = resolvers;