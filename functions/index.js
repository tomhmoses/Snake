const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });

// Create a new game in Firestore and return the game ID.
exports.createGame = functions.https.onRequest(async (req, res) => {
    // get the game size from the request
    const size = parseInt(req.query.size);
    // create the board
    const board = createBoard(size);
    console.log('board', board);
    // create a new game in Firestore using the Firebase Admin SDK
    var game = {board: board, size: size, turn: 0, winner: null, started: false};
    game['players'] = {};
    game['players'][req.query.uid] = {symbol: 'X', color: 'indigo'};
    const writeResult = await admin.firestore().collection('games').add(game);
    res.json({result: `Game with ID: ${writeResult.id} created.`, gameId: writeResult.id});
});

// Join a game
exports.joinGame = functions.https.onRequest(async (req, res) => {
    // get the game ID from the request
    const gameId = req.query.gameId;
    // get the player's UID from the request
    const uid = req.query.uid;
    // get the player's symbol from the request
    const symbol = req.query.symbol;
    // get the player's color from the request
    const color = req.query.color;
    // check if the game exists
    const gameRef = admin.firestore().collection('games').doc(gameId);
    const gameData = await gameRef.get();
    if (!gameData.exists) {
        res.status(404).send('Game not found.');
        return;
    }
    // check if game is started
    if (gameData.data().started) {
        res.status(400).send('Game already started.');
        return;
    }
    // check if the player is already in the game
    const players = gameData.data().players;
    console.log('players', players);
    if (players[uid]) {
        res.status(400).send('Player already in game.');
        return;
    }
    // check if symbol is already in use
    const symbols = Object.values(players).map(player => player.symbol);
    if (symbols.includes(symbol)) {
        res.status(400).send('Symbol already in use.');
        return;
    }
    // add the player to the game
    players[uid] = {symbol: symbol, color: color};
    await gameRef.update({players: players});
    res.json({result: `Player with UID: ${uid} added to game with ID: ${gameId}.`});
});

// Play a turn in a game
exports.playTurn = functions.https.onRequest(async (req, res) => {

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
.onCreate((snap, context) => {
  // Grab the current value of what was written to Firestore.
  const original = snap.data().original;

  // Access the parameter `{documentId}` with `context.params`
  functions.logger.log('Uppercasing', context.params.documentId, original);
  
  const uppercase = original.toUpperCase();
  
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return snap.ref.set({uppercase}, {merge: true});
});

function createBoard(size) {
  // cannot store nested arrays in Firestore, so using strings of characters for inner ones
  const blank='_';
  return [...Array(size)].map(() => blank.repeat(size))
}