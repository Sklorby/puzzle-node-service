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

const PORT = 3001;

// Database Name
const dbName = 'puzzle_game';

// Collection name
const room_collection = 'room_values';


let redisClient = new Redis();;

//connect to redis
// (async () => {
//   redisClient = new Redis();
//   console.log("connecting redis");
//   redisClient.on("error", (error) => console.error(`Error : ${error}`));

//   await redisClient.connect();
//   console.log("Redis connected")
// })();

// Connect to the server
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB successfully!');

  // Further operations will be performed here
});

// redisClient.on('connect', function() {
//   console.log('connected redis')
// })

// redisClient.set('frame', 'ReactJS', function(err, reply) {
//   console.log("I am sets", reply);

//   if(err){
//     console.log("error", err);
//   }
// })

const db = client.db(dbName);
const collection = db.collection(room_collection);


const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const players = {};


app.get('/getInitialSprite/:playerId/:roomId', function (req, res) {
  const playerId = req.params.playerId;
  const roomId = req.params.roomId;

  const newSpriteObject = getPlayerSprites(roomId,playerId);


})





io.on('connection', (socket) => {
  console.log('a user connected');

  // const roomData = {
  //   roomId: 'sdhjhscs',
  //   socketId: socket.id,
  //   data: {['hshhfhs'] : {}},
  //   timestamp: new Date()
  // }
  // dataActions(roomData, 'djjhsdhsjf')
  

  // Register a player with a socket ID and optional name
  socket.on('registerPlayer', (name) => {
    const playerId = socket.id;
    players[playerId] = { name };
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

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
