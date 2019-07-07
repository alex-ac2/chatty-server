const { gql, PubSub } = require("apollo-server-express");
const pubsub = new PubSub();


const NEW_USER = "NEW_USER";
const USER_TOTAL_CHANGED = 'USER_TOTAL_CHANGED';

let counter = 0;


const resolvers = {
  Query: {
    hello: (parent, {name}) => {
      return `hey ${name}`
    },
    userCount: () => 2,
    numOfUser: () => counter,
    user: () => ({
      id: 1,
      username: "tom"
    })
  },
  NumOfUser: {
    count: () => {
      return 88;
    }
  },
  User: {
    firstLetterOfUsername: (parent) => {
      return parent.username[0];
    }
    // username: (parent) => {
    //   console.log(parent);
    //   return parent.username;
    // }
  },
  Subscription: {
    newUser: {
      subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator(NEW_USER)
    },
    numOfUser:  {
      subscribe: () => {
        return pubsub.asyncIterator(USER_TOTAL_CHANGED);
      }
    }
  },
  Mutation: {
    login: async (parent, {userInfo: {username, password, age}}, context, info ) => {
      //Check for password
      // await checkPassword(password);
      // console.log(context);
      return username;
    },
    updateNum: (parent, {count} ) => {
      pubsub.publish(USER_TOTAL_CHANGED, {
        numOfUser: count 
      });
      counter = count;
      console.log('updateNum: ', count);
      return count;
    },
    register: (parent, {userInfo: {username} }, { pubsub }) => {
      const user = {
        id: 1,
        username
      };
      
      pubsub.publish(NEW_USER, {
        newUser: user
      });
      
      return {
        errors: [
          {
            fields: 'username',
            message: 'bad'
          },
          {
            fields: 'username2',
            message: 'bad2'
          }
        ],
        user 
      };
    }
  }
};

module.exports = resolvers;