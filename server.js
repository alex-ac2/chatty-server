// Server and socket 
const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');
const cors = require('cors');

// GraphQL Apollo Server
const graphqlHTTP = require('express-graphql');
const {ApolloServer, gql} = require('apollo-server-express');
const schema = require('./src/schema');
const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');


//extras
const bodyParser = require('body-parser');
const createServer = require('http').createServer;
const execute = require('graphql').execute;
const subscribe = require('graphql').subscribe;
const PubSub = require('graphql-subscriptions').PubSub;
const SubscriptionServer = require('subscriptions-transport-ws').SubscriptionServer;



// Set the port to 3001
const PORT = 3001;

// Create a new express server (Chat-socket connection)
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const app = express(); // Express server running GraphQL instance

// Allow cross-origin requests
app.use(cors());

// let root = { 
//   hello: () => 'Hello world!',
//   userCount: () => 0,
//   onlineCount: () => 1,
//   onlineCount2: 2,
//   numOfUser: 8,
//   Subscription: {
//     numOfUser: {
//       subscribe: () => pubsub.asyncIterator(USER_COUNT_CHANGED)
//     }
//   },
// };

// GraphQL route
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// }));

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers
});

graphqlServer.applyMiddleware({ app });

//app.use('./graphql', graphqlServer)

const pubsub = new PubSub();
const subServer = createServer(app);


subServer.listen(5000, () => {
  console.log("GraphQL running on port 5000...")
  new SubscriptionServer({
    execute,
    subscribe,
    schema: schema,
  }, {
    server: subServer,
    path: '/subscriptions',
  });
});

const USER_COUNT_CHANGED = 'numOfUser';

// const resolvers = {
//   Subscription: {
//       numOfUser: {
//         subscribe: () => pubsub.asyncIterator(USER_COUNT_CHANGED)
//       }
//   },
// };



// Create the WebSockets server for chat-message
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
let connectionCount = 0

// Socket methods
// Broadcast
SocketServer.prototype.broadcast = (messageData) => {
  wss.clients.forEach( (eachClient) => {
    eachClient.send(JSON.stringify(messageData));
  });
};


// Socket on connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  connectionCount ++;
  console.log('Connection Count: ', connectionCount);
  console.log('SIZE: ', wss.clients.size);
  root.onlineCount2 = wss.clients.size;
  root.numOfUser = wss.clients.size;

  pubsub.publish(USER_COUNT_CHANGED, { numOfUser: 8});

  ws.on('message', (incomingData) => {
    console.log(incomingData);
    console.log(typeof incomingData);

    // Parse incoming data and assign uid
    parsedIncomingData = JSON.parse(incomingData);
    const {type, content, username, date} = parsedIncomingData;
    const id = uuidv4();

    const newMessageObject = {
      type: type,
      content: content,
      username: username,
      date: date,
      id: id
    }

    console.log('OUTGOING: ', JSON.stringify(newMessageObject));
    // Broadcast incoming data to all connect clients
    // wss.clients.forEach( (eachClient) => {
    //   eachClient.send(JSON.stringify(newMessageObject));
    // });

 
    //Send Broadcast
    wss.broadcast(newMessageObject);


  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => { 
    console.log('Client disconnected');
    connectionCount--;
  });

});
