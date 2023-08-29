const dbName = 'puzzle_game';
const { MongoClient } = require('mongodb');
const { getRandomSprites, setPlayerObjects } = require('./utils');

// Connection URL
const url =
  'mongodb+srv://sarpap:1inamillion@cluster0.9uq0rgf.mongodb.net/puzzle_game?retryWrites=true&w=majority';

const client = new MongoClient(url, { useUnifiedTopology: true });
const db = client.db(dbName);
const collection = db.collection('game_rooms');

const player_collection = db.collection('players');

const collectionName = 'game_rooms';

// Connect to the MongoDB server
const connect = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

// Close the database connection
const close = async () => {
  try {
    await client.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error closing the database connection:', err);
  }
};

/**
 *
 *Check this link for the query stuff : https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
 */

// Assuming you have data received from a Socket.IO room
// const roomData = {
//   roomId: 'your_room_id',
//   socketId: '12345',
//   data: 'example',
//   timestamp: new Date()
// };

// const playerId = 'your_player_id';

const dataActions = (roomData, playerId, client) => {
  // Connect to the MongoDB server

  client.connect((err) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
    }
    console.log('Connected to MongoDB successfully!');

    // Continue with your code here, such as performing database operations

    // Close the connection when you're done
    client.close();
  });

  // Check if the room already exists
  // console.log("in here wlahi");
  // collection.insertOne(roomData, (err, result) => {
  //     if (err) {
  //       console.error('Error inserting new player:', err);
  //       return;
  //     }
  //     console.log('New player inserted successfully!');
  //   });
};

const pushValuesByRoomId = (roomData, playerId) => {
  collection.findOne({ roomId: roomData.roomId }, (err, room) => {
    console.log('the error room', err, room);
    if (err) {
      console.error('Error finding room:', err);
      return;
    }

    if (room) {
      // Room exists, insert or update player data as before
      collection = db.collection('players');

      // Check if the player already exists
      collection.findOne({ playerId: playerId }, (err, player) => {
        if (err) {
          console.error('Error finding player:', err);
          return;
        }

        if (player) {
          // Player exists, push the new object into the player's array
          collection.updateOne(
            { playerId: playerId },
            {
              $push: {
                dataArray: {
                  data: roomData.data,
                  timestamp: roomData.timestamp,
                },
              },
            },
            (err, result) => {
              if (err) {
                console.error('Error updating player data:', err);
                return;
              }
              console.log('Player data updated successfully!');
            }
          );
        } else {
          // Player doesn't exist, insert a new player document with the initial array
          const newPlayer = {
            playerId: playerId,
            roomId: roomData.roomId,
            dataArray: [{ data: roomData.data, timestamp: roomData.timestamp }],
          };

          collection.insertOne(newPlayer, (err, result) => {
            if (err) {
              console.error('Error inserting new player:', err);
              return;
            }
            console.log('New player inserted successfully!');
          });
        }
      });
    } else {
      console.log('starting to insert since');
      // Room doesn't exist, insert a new room document and player document
      collection.insertOne(roomData, (err, result) => {
        if (err) {
          console.error('Error creating new room:', err);
          return;
        }
        console.log('New room created successfully!');

        // Also insert the player document
        collection = db.collection('players');
        const newPlayer = {
          playerId: playerId,
          roomId: roomData.roomId,
          dataArray: [{ data: roomData.data, timestamp: roomData.timestamp }],
        };

        collection.insertOne(newPlayer, (err, result) => {
          if (err) {
            console.error('Error inserting new player:', err);
            return;
          }
          console.log('New player inserted successfully!');
        });
      });
    }
  });
};

// const pushValuesByRoomId = (roomData, playerId) => {
//   collection.findOne({ roomId: roomData.roomId }, (err, room) => {
//     console.log("the error room", err,room)
//     if (err) {
//       console.error('Error finding room:', err);
//       return;
//     }

//     if (room) {
//       // Room exists, insert or update player data as before
//       collection = db.collection('players');

//       // Check if the player already exists
//       collection.findOne({ playerId: playerId }, (err, player) => {
//         if (err) {
//           console.error('Error finding player:', err);
//           return;
//         }

//         if (player) {
//           // Player exists, push the new object into the player's array
//           collection.updateOne(
//             { playerId: playerId },
//             { $push: { dataArray: { data: roomData.data, timestamp: roomData.timestamp } } },
//             (err, result) => {
//               if (err) {
//                 console.error('Error updating player data:', err);
//                 return;
//               }
//               console.log('Player data updated successfully!');
//             }
//           );
//         } else {
//           // Player doesn't exist, insert a new player document with the initial array
//           const newPlayer = {
//             playerId: playerId,
//             roomId: roomData.roomId,
//             dataArray: [{ data: roomData.data, timestamp: roomData.timestamp }]
//           };

//           collection.insertOne(newPlayer, (err, result) => {
//             if (err) {
//               console.error('Error inserting new player:', err);
//               return;
//             }
//             console.log('New player inserted successfully!');
//           });
//         }
//       });
//     } else {
//         console.log("starting to insert since")
//       // Room doesn't exist, insert a new room document and player document
//       collection.insertOne(roomData, (err, result) => {
//         if (err) {
//           console.error('Error creating new room:', err);
//           return;
//         }
//         console.log('New room created successfully!');

//         // Also insert the player document
//         collection = db.collection('players');
//         const newPlayer = {
//           playerId: playerId,
//           roomId: roomData.roomId,
//           dataArray: [{ data: roomData.data, timestamp: roomData.timestamp }]
//         };

//         collection.insertOne(newPlayer, (err, result) => {
//           if (err) {
//             console.error('Error inserting new player:', err);
//             return;
//           }
//           console.log('New player inserted successfully!');
//         });
//       });
//     }
//   });
// }

const setupPlayerByRoom = async (playerId, playerRoomId) => {
  await connect();

  const db = client.db(dbName);
  const collection = db.collection('game_rooms');

  const { roomExists, isPlayerExist, updatedSprite } = await checkIfRoomExists(
    playerId,
    playerRoomId
  );
  console.log('the boolean', roomExists);

  if (roomExists && isPlayerExist) {
    console.log('Both room and player exist');
    // Perform the set operation
  } else if (roomExists && !isPlayerExist) {
    console.log(
      'Room exists but player is not in the room. Putting player in room'
    );
    await updateRoomWithPlayer(playerId, playerRoomId, updatedSprite);
  } else if (!roomExists) {
    console.log('Room does not exist, creating new room with player');
    await createNewRoom(playerId, playerRoomId);
  } else {
    console.log('There is something wrong trying to add player to a room');
  }
};

const checkIfRoomExists = async (playerId, playerRoomId) => {
  await connect();

  const db = client.db(dbName);
  const collection = db.collection('game_rooms');

  let roomExists = false;
  let document;

  // Query to find the document
  const query = {
    roomId: playerRoomId,
  };

  await collection
    .findOne(query)
    .then((result) => {
      if (result == null) {
        console.log('Room does not exist', err);
        roomExists = false;
      } else {
        roomExists = true;
        console.log('The result in checking if room exists', result);
        document = result;
      }
    })
    .catch((err) => {
      console.log('Room does not exist', err);
      roomExists = false;
    });

  const isPlayerExist = roomExists
    ? await checkIfPlayerExistsInRoom(playerId, document)
    : false;
  const updatedRoomSprites = roomExists ? await updateRoomSprite(document) : {};

  const roomContains = {
    roomExists: roomExists,
    isPlayerExist: isPlayerExist,
    updatedSprite: updatedRoomSprites,
  };

  return roomContains;
};

const checkIfPlayerExistsInRoom = async (playerId, document) => {
  console.log('The document in check ', document);
  const playerHasKey = document?.players?.some((player) => {
    return Object.keys(player).some((key) => key === playerId);
  });

  return playerHasKey ? true : false;
};

const insertValueForPlayerId = async () => {
  // Update query
  const filter = {
    roomId: playerRoomId,
    [`players.${playerId}`]: { $exists: true },
  };

  // Update operation
  const update = {
    $push: {
      [`players.$[elem].${playerId}`]: 'newItem',
    },
  };

  // Array filter
  const options = {
    arrayFilters: [{ [`elem.${playerId}`]: { $exists: true } }],
  };

  const updateResult = await collection.updateOne(filter, update, options);
  console.log(
    `Items pushed into the array with key "${coda}":`,
    updateResult.modifiedCount
  );
};

const createNewRoom = async (playerId, playerRoomId) => {
  const randomSpriteObject = await getRandomSprites();

  const roomData = {
    roomSprites: [randomSpriteObject?.name],
    roomId: playerRoomId,
    players: [{ [playerId]: [randomSpriteObject?.randomSprite] }],
  };
  collection
    .insertOne(roomData)
    .then((result) => {
      console.log('New player and room inserted successfully!');
    })
    .catch((err) => {
      console.error('Error inserting new player:', err);
      return;
    });

  return;
};

const updateRoomWithPlayer = async (
  playerId,
  playerRoomId,
  updatedRoomSprites
) => {
  // Update query
  const filter = {
    roomId: playerRoomId,
  };

  // Update operation
  const update = {
    $push: {
      players: { [playerId]: [updatedRoomSprites?.playerSprite] },
    },
  };

  // Define the update operation to override the field
  const updateField = {
    $set: {
      roomSprites: updatedRoomSprites?.roomSprites,
    },
  };

  // Perform the update operation
  await collection.updateOne(filter, updateField, function (err, result) {
    if (err) {
      console.error('Error updating document:', err);
      return;
    }

    console.log('Field overridden successfully!');
  });

  await collection
    .updateOne(filter, update)
    .then((result) => {
      if (result.matchedCount === 1) {
        console.log('Player added to room');
      } else {
        console.log('No matching document found');
      }
    })
    .catch((err) => {
      console.error('Error adding player to room:', err);
      return;
    });
};

const updateRoomSprite = (document) => {
  console.log('the document in finding sprite', document);
  const roomSprites = document?.roomSprites;
  const newPlayerObject = setPlayerObjects(roomSprites);

  console.log('Name about to be pushed', newPlayerObject?.name);
  const name = newPlayerObject?.name;
  roomSprites.push(name);

  const newSprites = [];

  roomSprites.forEach((element) => {
    newSprites.push(element);
  });

  console.log('Thee name', name);
  newSprites.push(name);

  console.log('After push', roomSprites);
  return {
    roomSprites: newSprites,
    playerSprite: newPlayerObject?.randomSprite,
  };
};

const getPlayerSprites = async (playerRoomId, playerId) => {
  await connect();

  const db = client.db(dbName);
  const collection = db.collection('game_rooms');

  let roomExists = false;
  let document;

  // Query to find the document
  const query = {
    roomId: playerRoomId,
  };

  await collection
    .findOne(query)
    .then((result) => {
      if (result == null) {
        console.log('Room does not exist so cannot get new sprite', err);
        roomExists = false;
      } else {
        roomExists = true;
        console.log(
          'The result in checking if room exists for sprites',
          result
        );
        document = result;
      }
    })
    .catch((err) => {
      console.log('Room does not exist so cannot get sprite', err);
      roomExists = false;
    });

  const players = document?.players;
  console.log('the players', players);
  // const playerSprites = players[playerId];

  const playerSpritesFind = players?.find((obj) =>
    obj.hasOwnProperty(playerId)
  );

  // this is to get all players in the room
  const playersInRoom = [];
  players?.forEach((obj) => {
    const keys = Object.keys(obj);
    console.log(keys[0]);
    if (keys[0] !== playerId) {
      playersInRoom.push(keys[0]);
    }
  });

  const playerSprites = playerSpritesFind[playerId];

  console.log('Returning player sprite', playerSprites);
  await close();

  const response = {
    playerSprites,
    players,
  };
  return response;
};

const insertplayerPlay = (playerId, playerRoom, playedObjects) => {};

const processRequest = (receivingPlayer, givingPlayer, playerRoom) => {
  /**
   * Get object from player array
   * Make sure the object is deleted from player array
   * Push the object to receiving player array
   * emit
   */
};

// const play = getPlayerSprites('another', 'cray');
// console.log('res', play)

module.exports = {
  dataActions,
  setupPlayerByRoom,
  getPlayerSprites,
};
