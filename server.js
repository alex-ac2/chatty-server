// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (incomingData) => {
    console.log(incomingData);
    console.log(typeof incomingData);

    // Parse incoming data and assign uid
    parsedIncomingData = JSON.parse(incomingData);
    const {type, content, username} = parsedIncomingData;
    const id = uuidv4();

    const newMessageObject = {
      type: type,
      content: content,
      username: username,
      id: id
    }

    console.log('OUTGOING: ', JSON.stringify(newMessageObject));
    // Broadcast incoming data to all connect clients
    wss.clients.forEach( (eachClient) => {
      eachClient.send(JSON.stringify(newMessageObject));
    });


  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});
