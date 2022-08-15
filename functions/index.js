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
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await admin.firestore().collection('messages').add({original: original});
//     // Send back a message that we've successfully written the message
//     res.json({result: `Message with ID: ${writeResult.id} added.`});
//   });

// Create a new game in Firestore and return the game ID.
exports.createGame = functions.https.onRequest(async (req, res) => {
    // get the game size from the request
    const size = parseInt(req.query.size);
    // get the win size from the request
    const winSize = parseInt(req.query.winSize);
    // check valid size
    if (size < 1) {
        res.status(400).send('Invalid size');
        return;
    }
    // check for valid win size
    if (winSize > size) {
        res.status(400).send('winSize must be less than or equal to size');
        return;
    }
    // create the board
    const board = createBoard(size);
    console.log('board', board);
    // create a new game in Firestore using the Firebase Admin SDK
    var game = {board: board, size: size, winSize: winSize, turn: 0, winner: null, started: false};
    game['players'] = {};
    game['players'][req.query.uid] = {symbol: 'X', color: 'indigo', playerNum: 0};
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
    players[uid] = {symbol: symbol, color: color, playerNum: Object.keys(players).length};
    await gameRef.update({players: players});
    res.json({result: `Player with UID: ${uid} added to game with ID: ${gameId}.`});
});

// Start a game
exports.startGame = functions.https.onRequest(async (req, res) => {
    // get the game ID from the request
    const gameId = req.query.gameId;
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
    // check if there are enough players
    const players = gameData.data().players;
    if (Object.keys(players).length < 2) {
        res.status(400).send('Not enough players.');
        return;
    }
    // start the game
    await gameRef.update({started: true});
    res.json({result: `Game with ID: ${gameId} started.`});
});

// Play a turn in a game
exports.playTurn = functions.https.onRequest(async (req, res) => {
    // get the game ID from the request
    const gameId = req.query.gameId;
    // get the player's UID from the request
    const uid = req.query.uid;
    // get the player's turn from the request
    const x = parseInt(req.query.x);
    const y = parseInt(req.query.y);
    // check if the game exists
    const gameRef = admin.firestore().collection('games').doc(gameId);
    const gameData = await gameRef.get();
    if (!gameData.exists) {
        res.status(404).send('Game not found.');
        return;
    }
    // check if game is started
    if (!gameData.data().started) {
        res.status(400).send('Game not started.');
        return;
    }
    // check if game is over
    if (gameData.data().winner) {
        res.status(400).send('Game already over.');
        return;
    }
    // check if the player is in the game
    const players = gameData.data().players;
    if (!players[uid]) {
        res.status(400).send('Player not in game.');
        return;
    }
    // check if is the player's turn
    const numOfplayers = Object.keys(players).length;
    console.log('numOfplayers', numOfplayers);
    console.log('turn', gameData.data().turn % numOfplayers);
    console.log('playerNum', players[uid].playerNum);
    if (gameData.data().turn % numOfplayers != players[uid].playerNum) {
        res.status(400).send('Wrong turn.');
        return;
    }
    // check if the x and y are valid
    if (x < 0 || x >= gameData.data().size || y < 0 || y >= gameData.data().size) {
        res.status(400).send('Invalid x or y.');
        return;
    }
    // check if the x and y are empty
    const board = gameData.data().board;
    console.log('board', board);
    console.log('x', x);
    console.log('y', y);
    console.log('whats there', board[y][x])
    if (board[y][x] != '_') {
        res.status(400).send('Space already taken.');
        return;
    }
    // play the turn
    board[y] = setCharAt(board[y], x, players[uid].symbol);
    await gameRef.update({board: board, turn: gameData.data().turn + 1});
    res.json({result: `Turn played.`});
});

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

// Check for a winner in a game
exports.checkWinner = functions.firestore.document('/games/{gameId}')
.onUpdate((snap, context) => { 
    // get the game data
    const gameData = snap.after.data();
    // convert board to 2D array
    var betterBoard = [];
    for (var i = 0; i < gameData.size; i++) {
        betterBoard.push(gameData.board[i].split(''));
    }
    console.log('betterBoard', betterBoard);
    console.log('winSize', gameData.winSize);
    // check if there is a winner
    var winner = checkForWinner(betterBoard, gameData.winSize);
    console.log('winner', winner);
    if (winner) {
        // update the game
        return snap.after.ref.update({winner: winner});
    }
    console.log('no winner');
});

function checkForWinner(board, winSize = 3) {
  // check horizontal
  var currentPlayer = ''
  var currentRun = 0
  var x
  var y
  for (x = 0; x < board.length; x++) {
      currentPlayer = ''
      currentRun = 0
      for (y = 0; y < board.length; y++) {
          //check for continuation
          if (board[y][x] !== '' && board[y][x] === currentPlayer) {
              currentRun++
              if (currentRun === winSize) {
                  // console.log('winner:')
                  // console.log(currentRun)
                  // console.log(currentPlayer)
                  return currentPlayer
              }
          } else {//switch to new player
              currentPlayer = board[y][x]
              currentRun = 1
          }
      }
  }
  // check vertical
  for (y = 0; y < board.length; y++) {
      currentPlayer = ''
      currentRun = 0
      for (x = 0; x < board.length; x++) {
          //check for continuation
          if (board[y][x] !== '' && board[y][x] === currentPlayer) {
              currentRun++
              if (currentRun === winSize) {
                  return currentPlayer
              }
          } else {//switch to new player
              currentPlayer = board[y][x]
              currentRun = 1
          }
      }
  }
  // check diagonal down right
  // start bottom left... start only when length possible
  // move to top right... stop when length impossible
  var calcDiagLength = (i) => { //calculate length of each diagonal
      if (i < board.length) {
          return i + 1
      } else {
          return board.length * 2 - 1 - i
      }
  }
  var calcDiagStartCoords = (i) => { //returns {x: ?, y: ?}
      if (i < board.length) {
          return { x: 0, y: board.length - 1 - i }
      } else {
          return { x: i - board.length - 2, y: 0 }
      }
  }
  var i
  var n
  var diagStartCoords
  var diagLength
  for (i = winSize - 1; i < (board.length * 2 - 1 - (winSize - 1)); i++) { //each diagonal is numbered (starting with 0), heres where to start and end.
      currentPlayer = ''
      currentRun = 0
      diagStartCoords = calcDiagStartCoords(i)
      diagLength = calcDiagLength(i)
      for (n = 0; n < diagLength; n++) {
          console.log('-')
          console.log(diagStartCoords)
          console.log(n)
          //check for continuation
          x = diagStartCoords.x + n
          y = diagStartCoords.y + n
          if (board[y][x] !== '' && board[y][x] === currentPlayer) {
              currentRun++
              if (currentRun === winSize) {
                  return currentPlayer
              }
          } else {//switch to new player
              currentPlayer = board[y][x]
              currentRun = 1
          }
      }
  }
  // check diagonal up right
  // start top left... 
  // end bottom right...
  var calcDiagUpStartCoords = (i) => { //returns {x: ?, y: ?}
      if (i < board.length) {
          return { x: 0, y: i }
      } else {
          return { x: i - board.length + 1, y: board.length - 1 }
      }
  }
  console.log('diag/..')
  for (i = winSize - 1; i < (board.length * 2 - 1 - (winSize - 1)); i++) { //each diagonal is numbered (starting with 0), heres where to start and end.
      currentPlayer = ''
      currentRun = 0
      diagStartCoords = calcDiagUpStartCoords(i)
      diagLength = calcDiagLength(i)
      for (n = 0; n < diagLength; n++) {
          console.log('-')
          console.log(diagStartCoords)
          console.log(n)
          //check for continuation
          x = diagStartCoords.x + n
          y = diagStartCoords.y - n
          if (board[y][x] !== '' && board[y][x] === currentPlayer) {
              currentRun++
              if (currentRun === winSize) {
                  return currentPlayer
              }
          } else {//switch to new player
              currentPlayer = board[y][x]
              currentRun = 1
          }
      }
  }
}


// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
// .onCreate((snap, context) => {
//   // Grab the current value of what was written to Firestore.
//   const original = snap.data().original;

//   // Access the parameter `{documentId}` with `context.params`
//   functions.logger.log('Uppercasing', context.params.documentId, original);
  
//   const uppercase = original.toUpperCase();
  
//   // You must return a Promise when performing asynchronous tasks inside a Functions such as
//   // writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return snap.ref.set({uppercase}, {merge: true});
// });

function createBoard(size) {
  // cannot store nested arrays in Firestore, so using strings of characters for inner ones
  const blank='_';
  return [...Array(size)].map(() => blank.repeat(size))
}