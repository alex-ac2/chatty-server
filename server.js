// Server and socket 
const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');
const cors = require('cors');

// GraphQL Apollo Server
const graphqlHTTP = require('express-graphql');
const {ApolloServer, gql, PubSub} = require('apollo-server-express');
const http = require('http');
const schema = require('./src/schema');
const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');
const createServer = require('http').createServer;

// Set the port to 3001
const PORT = 3001;  // Chat Socket Server
const PORT2 = 5000;  // GraphQL Server

// Create a new express server (Chat-socket connection)
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Chat socket server listening on ${ PORT }`));

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => ({ req, res, pubsub })
});

const app = express();  // Express server running GraphQL instance
app.use(cors());  // Allow cross-origin requests
graphqlServer.applyMiddleware({ app });

const httpServer = http.createServer(app);
graphqlServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT2, () => {
  console.log(`Apollo GraphQL server running at http://localhost:${PORT2}${graphqlServer.graphqlPath}`);
  console.log(`Subscriptions ready at ws://localhost:${PORT2}${graphqlServer.subscriptionsPath}`)
});

const pubsub = new PubSub();

// Create the WebSockets server for chat-message
const wss = new SocketServer({ server });

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
  // root.onlineCount2 = wss.clients.size;
  // root.numOfUser = wss.clients.size;

  //pubsub.publish(USER_COUNT_CHANGED, { numOfUser: 8});

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
    //Send Broadcast
    wss.broadcast(newMessageObject);

  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => { 
    console.log('Client disconnected');
    connectionCount--;
  });

});
