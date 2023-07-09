const express = require('express');
const prettier = require('prettier');
const Redis = require('ioredis');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
const cors = require('cors');
const { dataActions, setupPlayerByRoom, getPlayerSprites } = require('./db');
const { client } = require('./mongo');
const { addObject } = require('./utils');

const PORT = 3001;

// Database Name
const dbName = 'puzzle_game';

// Collection name
const room_collection = 'room_values';


let redisClient = new Redis();;

// Connect to the server
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB successfully!');

  // Further operations will be performed here
});

const db = client.db(dbName);
const collection = db.collection(room_collection);


const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const players = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  // const roomData = {
  //   roomId: 'sdhjhscs',
  //   socketId: socket.id,
  //   data: {['hshhfhs'] : {}},
  //   timestamp: new Date()
  // }
  // dataActions(roomData, 'djjhsdhsjf')

  socket.on('spriteRequest', (requestingPlayer, spriteName, respondingPlayer) => {
    console.log(`Receieved request from ${requestingPlayer} to get sprite ${spriteName} from ${respondingPlayer}`);
    
    const socketId = players[respondingPlayer];
    redisClient.get(respondingPlayer, (err, targetSocketId) => {
      if (targetSocketId) {
        console.log(`The socket id for responding player: ${respondingPlayer} is  ${targetSocketId}`);
        io.to(targetSocketId).emit('spriteRequest', requestingPlayer, spriteName);
      }
    });
  });

  socket.on('sendToRequestingPlayer', (requestingPlayer, playerObject) => {
    console.log(`Sending object to ${requestingPlayer}`);

    let name = `${requestingPlayer}-list`;
    redisClient.lpush(name, playerObject);
    
    const socketId = players[requestingPlayer];
    redisClient.get(requestingPlayer, (err, targetSocketId) => {
      if (targetSocketId) {
        console.log(`Sending request to object to requesting player: ${requestingPlayer} with socketId ${targetSocketId}`);
        io.to(targetSocketId).emit('exchangedSprites', playerObject);
      }
    });
  });
  

  // Register a player with a socket ID and optional name
  socket.on('registerPlayer', (name) => {
    const playerId = socket.id;
    players[playerId] = { name };
    redisClient.set(playerId, socket.id)
    console.log(`Player ${playerId} registered with name "${name}".`);
  });

  // Listen for player values
  socket.on('playerValues', (roomId, playerId, values) => {
    console.log(`received values to room: ${roomId} from player ${playerId}:`, values);
    
    const roomData = {
      roomId,
      socketId: socket.id,
      data: {[playerId] : values},
      timestamp: new Date()
    }

    // Generate a unique key for the room data
    const key = `websocket_data:${roomId}`;


    const playerObject = values;



    // Check if the object exists in Redis cache
doesObjExistInRedis(key, (exists) => {
  if (exists) {
    // Retrieve the object from Redis and perform operations
    getObjFromRedis(key, (retrievedObj) => {
      const res = addObject(retrievedObj, playerId, playerObject);

      // Store the modified object back in Redis
      storeObjInRedis(key, res);
    });
  } else {

    const res = addObject([], playerId, playerObject);
    // Store the modified object back in Redis
    storeObjInRedis(key, res);
  }
});

    console.log("the key", key);

    // Store the data in Redis cache for the room
    redisClient.rpush(key, JSON.stringify(roomData?.data))
               .then((response) => console.log(`Data stored in Redis for room ${roomId}:`, roomData?.data))
               .catch((err) => console.error('Failed to store data in Redis:', err));

    console.log("the rooom data", roomData);
    dataActions(roomData, playerId, client)
    // Broadcast the values to all other players in the same room as the sender
    // socket.to(roomId).emit('playerValues', {[playerId] : values});
    socket.to(roomId).emit('playerValues', values);
    console.log(`emitting values to other players:`, {[playerId] : values});
  });

  //list for update shape position
  socket.on("updatedPlayerValues", (roomId, playerId, updatedShape) => {
    console.log(`received updated position values to room: ${roomId} from player ${playerId}:`, updatedShape);
    socket.broadcast.emit("updatedPlayerValues", playerId, updatedShape);
  });

  // Listen for a player joining a room
  socket.on('joinRoom', async (roomId) => {

    // leave the current room if any
    if(socket.roomId){
      socket.leave(socket.roomId)
    }

    //Join the new room
    socket.join(roomId);
    socket.roomId = roomId;
    const playerId = players[socket.id].name;

    redisClient.set(playerId, socket.id);

    console.log(`player ${socket.id} with name ${players[socket.id].name} joined room ${roomId}`);

    console.log(`Adding ${players[socket.id].name} to room ${roomId} in mongoDB`);

    await setupPlayerByRoom(playerId, roomId)

    const newSpriteObject = await getPlayerSprites(roomId,playerId);

    console.log('Player added to room');

    const clientsInRoom = await io.in(socket.id).allSockets();
    console.log('all the sockets', clientsInRoom);

    console.log('About to send ne sprite object', newSpriteObject);
    io.to(socket.id).emit('newGameSprite', newSpriteObject);

    // const clientsInRoom = await io.in(socket.id).allSockets();
    // console.log('all the sockets', clientsInRoom);
  
    // // Retreive data from redis and emit to the room
    // const key = `websocket_data:${roomId}`;

    // redisClient.lrange(key, 0,-1).then((data) => {
    //   if(data){
    //     console.log("Getting data from redis", data);
        
    //     const playerMap = new Map();
    //     data.forEach(element => {
    //       const playerData = JSON.parse(element);
    //       console.log("the meeeeeeee", playerData)
    //       const keys = Object.keys(playerData);
    //       const dataKey = keys?.[0];

    //       const dataObject = playerData?.[dataKey]

    //       if(playerMap.has(dataKey)){
    //         dataObject?.map((element) => {
    //           playerMap.get(dataKey).push(element);
    //         })  
    //       }else{
    //         const playerDataArray = [];
    //         dataObject?.map((element) => {
    //           playerDataArray.push(element);
    //         });  
    //         playerMap.set(dataKey, playerDataArray);
    //       }
    //     });
        
    //     console.log("player data convertted", playerMap)
        // io.to(roomId).emit('playerValues', Array.from(playerMap.entries()));
    //   }
    // })
    // .catch((err) => {
    //   console.error('Failed to retrieve data from Redis:', err);
    // })
  });


  // Listen for a player leaving a room
  socket.on('leaveRoom', (roomId) => {
    console.log(`player ${socket.id} left room ${roomId}`);
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


// Function to retrieve the object from Redis cache
function getObjFromRedis(key, callback) {
  redisClient.get(key, (error, objStr) => {
    if (error) {
      console.error("Error retrieving object from Redis:", error);
      callback([]);
    } else {
      const obj = JSON.parse(objStr) || [];
      callback(obj || []);
    }
  });
}


// Function to store the object in Redis cache
function storeObjInRedis(key, obj) {
  redisClient.set(key, JSON.stringify(obj), (error) => {
    if (error) {
      console.error("Error storing object in Redis:", error);
    } else {
      console.log("Object stored in Redis cache");
    }
  });
}


// Function to check if the object exists in Redis cache
function doesObjExistInRedis(key, callback) {
  redisClient.exists(key, (error, exists) => {
    if (error) {
      console.error("Error checking object existence in Redis:", error);
      callback(false);
    } else {
      callback(exists === 1);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
