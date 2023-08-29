const express = require('express');
const Redis = require('ioredis');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true,
  },
});
const cors = require('cors');
const { dataActions, setupPlayerByRoom, getPlayerSprites } = require('./db');
const { client } = require('./mongo');
const { addObject, removeObject } = require('./utils');

const PORT = 3001;

// Database Name

// Collection name

let redUr = `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT_URI}`;
let redisClient = new Redis(redUr);

// local run
// let redisClient = new Redis();

// Connect to the server
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB successfully!');

  // Further operations will be performed here
});

// http://localhost:3000
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const players = {};
let admins = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  // const roomData = {
  //   roomId: 'sdhjhscs',
  //   socketId: socket.id,
  //   data: {['hshhfhs'] : {}},
  //   timestamp: new Date()
  // }
  // dataActions(roomData, 'djjhsdhsjf')

  socket.on(
    'spriteRequest',
    (requestingPlayer, spriteName, respondingPlayer) => {
      console.log(
        `Receieved request from ${requestingPlayer} to get sprite ${spriteName} from ${respondingPlayer}`
      );

      redisClient.get(respondingPlayer, (err, targetSocketId) => {
        if (targetSocketId) {
          console.log(
            `The socket id for responding player: ${respondingPlayer} is  ${targetSocketId}`
          );
          io.to(targetSocketId).emit(
            'spriteRequest',
            requestingPlayer,
            spriteName
          );
        }
      });
    }
  );

  socket.on('sendToRequestingPlayer', (requestingPlayer, playerObject) => {
    console.log(`Sending object to ${requestingPlayer}`);

    let name = `${requestingPlayer}-list`;
    redisClient.lpush(name, playerObject);

    redisClient.get(requestingPlayer, (err, targetSocketId) => {
      if (targetSocketId) {
        console.log(
          `Sending request to object to requesting player: ${requestingPlayer} with socketId ${targetSocketId}`
        );
        io.to(targetSocketId).emit('exchangedSprites', playerObject);
      }
    });
  });

  // Register a player with a socket ID and optional name
  socket.on('registerPlayer', (name) => {
    const playerId = socket.id;
    players[playerId] = { name };
    redisClient.set(playerId, socket.id);
    console.log(`Player ${playerId} registered with name "${name}".`);
  });

  // Register a admin with a socket ID and room name
  socket.on('registerAdmin', (roomName) => {
    const adminId = socket.id;
    admins[roomName] = adminId;
    console.log('the admins', admins);
    const key = `websocket_admin:${roomName}`;
    console.log('socketId for admin', socket.id, key);
    redisClient.set(key, socket.id);
    console.log(`Admin ${adminId} registered with room "${roomName}".`);
  });

  // Get all player objects for the playground
  socket.on('getPlayground', async (roomId) => {
    const key = `websocket_data:${roomId}`;
    redisClient.get(key, (playgroundValues) => {
      console.log('Playground values being sent to room', roomId);
      socket.to(roomId).emit('playergroundObjects', playgroundValues);
    });
  });

  // Listen for player values
  socket.on('playerValues', async (roomId, playerId, values, isRemove) => {
    console.log(
      `received values to room: ${roomId} from player ${playerId}:`,
      values
    );

    const roomData = {
      roomId,
      socketId: socket.id,
      data: { [playerId]: values },
      timestamp: new Date(),
    };

    // Generate a unique key for the room data
    const key = `websocket_data:${roomId}`;

    const playerObject = values;
    let res = [];
    console.log('The is a removal', isRemove);
    if (isRemove) {
      console.log('About to remove sprite from redis');

      // Check if the object exists in Redis cache
      doesObjExistInRedis(key, async (exists) => {
        if (exists) {
          console.log('It exists for removal');
          // Retrieve the object from Redis and perform operations
          getObjFromRedis(key, async (retrievedObj) => {
            const id = values?.shapeUri;
            console.log('the object id', id);
            res = await removeObject(retrievedObj, playerId, id);
            console.log('emitting values to other players:', res, roomId);
            socket.to(roomId).emit('playerValues', res);
            const adminKey = `websocket_admin:${roomId}`;
            console.log('the keeeeeeey', adminKey, admins[roomId]);
            io.to(admins[roomId]).emit('playergroundObjects', res);
            // Store the modified object back in Redis
            storeObjInRedis(key, res);
          });
        } else {
          console.log('Nothing to remove', res);
        }
      });
    } else {
      // Check if the object exists in Redis cache
      doesObjExistInRedis(key, async (exists) => {
        if (exists) {
          console.log('It exists');
          // Retrieve the object from Redis and perform operations
          getObjFromRedis(key, async (retrievedObj) => {
            res = await addObject(retrievedObj, playerId, playerObject);
            console.log('emitting values to other players:', res);
            socket.to(roomId).emit('playerValues', res);
            const adminKey = `websocket_admin:${roomId}`;
            console.log('the admin key in exists', adminKey, admins[roomId]);
            io.to(admins[roomId]).emit('playergroundObjects', res);
            // Store the modified object back in Redis
            storeObjInRedis(key, res);
          });
        } else {
          res = await addObject([], playerId, playerObject);
          console.log('emitting values to other players:', res);
          socket.to(roomId).emit('playerValues', res);
          const adminKey = `websocket_admin:${roomId}`;
          console.log('the admin key', adminKey, admins[roomId]);
          io.to(admins[roomId]).emit('playergroundObjects', res);
          // Store the modified object back in Redis
          storeObjInRedis(key, res);
        }
      });
    }

    console.log('the rooom data', roomData);
    dataActions(roomData, playerId, client);
  });

  //list for update shape position
  socket.on('updatedPlayerValues', (roomId, playerId, updatedShape) => {
    console.log(
      `received updated position values to room: ${roomId} from player ${playerId}:`,
      updatedShape
    );
    socket.broadcast.emit('updatedPlayerValues', playerId, updatedShape);
  });

  // Listen for a player joining a room
  socket.on('joinRoom', async (roomId, isAdmin = false) => {
    console.log('in join');
    // leave the current room if any
    if (socket.roomId) {
      socket.leave(socket.roomId);
    }

    //Join the new room
    socket.join(roomId);
    socket.roomId = roomId;

    if (isAdmin) {
      const key = `websocket_admin:${roomId}`;
      console.log('socketId for admin', socket.id, key);
      redisClient.set(key, socket.id);
      return;
    }

    const playerId = players[socket.id].name;

    redisClient.set(playerId, socket.id);

    console.log(
      `Adding ${players[socket.id].name} to room ${roomId} in mongoDB`
    );

    await setupPlayerByRoom(playerId, roomId);

    const newSpriteObject = await getPlayerSprites(roomId, playerId);

    console.log('Player added to room');

    const clientsInRoom = await io.in(socket.id).allSockets();
    console.log('all the sockets', clientsInRoom);

    console.log('About to send ne sprite object', newSpriteObject);
    io.to(socket.id).emit('newGameSprite', newSpriteObject);
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
      console.error('Error retrieving object from Redis:', error);
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
      console.error('Error storing object in Redis:', error);
    } else {
      console.log('Object stored in Redis cache');
    }
  });
}

// Function to check if the object exists in Redis cache
function doesObjExistInRedis(key, callback) {
  redisClient.exists(key, (error, exists) => {
    if (error) {
      console.error('Error checking object existence in Redis:', error);
      callback(false);
    } else {
      callback(exists === 1);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
