const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// Create a new game in Firestore and return the game ID.
exports.createGame = functions
    .region("europe-west2").https.onRequest(async (req, res) => {
      res.set("Access-Control-Allow-Origin", "*");
      // get uid from idToken
      const uid = await getUid(req.query.idToken);
      // check we have a uid
      if (!uid) {
        res.status(401).send("Unauthorized");
        return;
      }
      // get the game size from the request
      const size = parseInt(req.query.size);
      // get the win size from the request
      const winSize = parseInt(req.query.winSize);
      // check valid size
      if (size < 1) {
        res.status(400).send("Invalid size");
        return;
      }
      // check for valid win size
      if (winSize > size) {
        res.status(400).send("winSize must be less than or equal to size");
        return;
      }
      // create the board
      const board = createBoard(size);
      console.log("board", board);
      // create a new game in Firestore using the Firebase Admin SDK
      const game = {
        board: board,
        size: size,
        winSize: winSize,
        turn: 0,
        winner: null,
        started: false,
        expireAt: newTTL(),
      };
      game["players"] = {};
      game["players"][uid] = {symbol: "X", color: "indigo", playerNum: 0};

      // create ID for the game
      let gameId = "";
      // create an unused gameId
      do {
        gameId = makeId(5);
        // eslint-disable-next-line max-len
      } while (await admin.firestore().collection("games").doc(gameId).get().then((doc) => {
        return doc.exists;
      }));
      // add the game to Firestore
      await admin.firestore().collection("games").doc(gameId).set(game);
      res.json({
        result: `Game with ID: ${gameId} created.`,
        gameId: gameId,
      });
    });

// Join a game
exports.joinGame = functions

    .region("europe-west2").https.onRequest(async (req, res) => {
      res.set("Access-Control-Allow-Origin", "*");
      // get uid from idToken
      const uid = await getUid(req.query.idToken);
      // check we have a uid
      if (!uid) {
        res.status(401).send("Unauthorized");
        return;
      }
      // get the game ID from the request
      const gameId = req.query.gameId;
      // check we were sent a gameId
      if (!gameId) {
        res.status(400).send("Game not found (no Id sent).");
        return;
      }
      // check if the game exists
      const gameRef = admin.firestore().collection("games").doc(gameId);
      const gameData = await gameRef.get();
      if (!gameData.exists) {
        res.status(404).send("Game not found.");
        return;
      }
      // check if the player is already in the game
      const players = gameData.data().players;
      console.log("players", players);
      if (players[uid]) {
        res.status(200).send("Cool! Player already in game.");
        return;
      }
      // get the player"s symbol from the request
      const symbol = req.query.symbol;
      // check we were sent a symbol
      if (!symbol) {
        res.status(400).send("Invalid Symbol");
        return;
      }
      // get the player"s color from the request
      const color = "" + req.query.color;
      // check if game is started
      if (gameData.data().started) {
        res.status(400).send("Game already started.");
        return;
      }
      // check if symbol is already in use
      const symbols = Object.values(players).map((player) => player.symbol);
      if (symbols.includes(symbol)) {
        res.status(400).send("Symbol already in use.");
        return;
      }
      // add the player to the game
      players[uid] = {
        symbol: symbol,
        color: color,
        playerNum: Object.keys(players).length,
      };
      await gameRef.update({players: players});
      res.json({
        result: "Cool! Player added.",
      });
    });

// Start a game
exports.startGame = functions
    .region("europe-west2").https.onRequest(async (req, res) => {
      res.set("Access-Control-Allow-Origin", "*");
      // get uid from idToken
      const uid = await getUid(req.query.idToken);
      // check we have a uid
      if (!uid) {
        res.status(401).send("Unauthorized");
        return;
      }
      // get the game ID from the request
      const gameId = req.query.gameId;
      // check if the game exists
      const gameRef = admin.firestore().collection("games").doc(gameId);
      const gameData = await gameRef.get();
      if (!gameData.exists) {
        res.status(404).send("Game not found.");
        return;
      }
      // check if game is started
      if (gameData.data().started) {
        res.status(400).send("Game already started.");
        return;
      }
      // check if there are enough players
      const players = gameData.data().players;
      if (Object.keys(players).length < 2) {
        res.status(400).send("Not enough players.");
        return;
      }
      // check the player is in the game
      if (!players[uid]) {
        res.status(400).send("Player not in game.");
        return;
      }
      // start the game
      await gameRef.update({started: true});
      res.json({result: `Game with ID: ${gameId} started.`});
    });

// Play a turn in a game
exports.playTurn = functions
    .region("europe-west2").https.onRequest(async (req, res) => {
      res.set("Access-Control-Allow-Origin", "*");
      // get uid from idToken
      const uid = await getUid(req.query.idToken);
      // check we have a uid
      if (!uid) {
        res.status(401).send("Unauthorized");
        return;
      }
      // get the game ID from the request
      const gameId = req.query.gameId;
      // get the player"s turn from the request
      const x = parseInt(req.query.x);
      const y = parseInt(req.query.y);
      // check if the game exists
      const gameRef = admin.firestore().collection("games").doc(gameId);
      const gameData = await gameRef.get();
      if (!gameData.exists) {
        res.status(404).send("Game not found.");
        return;
      }
      // check if game is started
      if (!gameData.data().started) {
        res.status(400).send("Game not started.");
        return;
      }
      // check if game is over
      if (gameData.data().winner) {
        res.status(400).send("Game already over.");
        return;
      }
      // check if the player is in the game
      const players = gameData.data().players;
      if (!players[uid]) {
        res.status(400).send("Player not in game.");
        return;
      }
      // check if is the player"s turn
      const numOfplayers = Object.keys(players).length;
      console.log("numOfplayers", numOfplayers);
      console.log("turn", gameData.data().turn % numOfplayers);
      console.log("playerNum", players[uid].playerNum);
      if (gameData.data().turn % numOfplayers != players[uid].playerNum) {
        res.status(400).send("Wrong turn.");
        return;
      }
      // check if the x and y are valid
      if (x < 0 || x >= gameData.data().size ||
    y < 0 || y >= gameData.data().size) {
        res.status(400).send("Invalid x or y.");
        return;
      }
      // check if the x and y are empty
      const board = gameData.data().board;
      console.log("board", board);
      console.log("x", x);
      console.log("y", y);
      console.log("whats there", board[y][x]);
      if (board[y][x] != "_") {
        res.status(400).send("Space already taken.");
        return;
      }
      // play the turn
      board[y] = setCharAt(board[y], x, players[uid].symbol);
      await gameRef.update({board: board, turn: gameData.data().turn + 1});
      res.json({result: "Turn played."});
    });

/**
 * Set character at a point in a string.
 * @param {str} str The string to modify.
 * @param {int} index The position to swap the character.
 * @param {chr} chr The chr to change to.
 * @return {str} The modified string.
 */
function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

exports.resetGame = functions
    .region("europe-west2").https.onRequest(async (req, res) => {
      res.set("Access-Control-Allow-Origin", "*");
      // get uid from idToken
      const uid = await getUid(req.query.idToken);
      // check we have a uid
      if (!uid) {
        res.status(401).send("Unauthorized");
        return;
      }
      // get the game ID from the request
      const gameId = req.query.gameId;
      // check if the game exists
      const gameRef = admin.firestore().collection("games").doc(gameId);
      const gameData = await gameRef.get();
      if (!gameData.exists) {
        res.status(404).send("Game not found.");
        return;
      }
      // create the board
      const board = createBoard(gameData.size);
      console.log("board", board);
      // create a new game in Firestore using the Firebase Admin SDK
      const game = {
        board: board,
        turn: 0,
        winner: null,
        started: false,
        expireAt: newTTL(),
      };
      // update the game in Firestore
      await gameRef.update(game);
    });

// Check for a winner in a game (and update TTL)
exports.checkWinner = functions
    .region("europe-west2").firestore.document("/games/{gameId}")
    .onUpdate((snap, context) => {
      // get the game data
      const gameData = snap.after.data();
      const previousData = snap.before.data();

      // We'll only do stuff if the turn has changed.
      // This is crucial to prevent infinite loops.
      if (gameData.turn == previousData.turn) {
        return null;
      }

      // convert board to 2D array
      const betterBoard = [];
      for (let i = 0; i < gameData.size; i++) {
        betterBoard.push(gameData.board[i].split("").map(
            (element) => {
              return element === "_" ? "" : element;
            }));
      }
      console.log("betterBoard", betterBoard);
      console.log("winSize", gameData.winSize);
      // check if there is a winner
      const winner = checkForWinner(betterBoard, gameData.winSize);
      console.log("winner", winner);
      if (winner) {
        // update the game
        return snap.after.ref.update(
            {winner: winner,
              expireAt: newTTL()});
      } else {
        return snap.after.ref.update(
            {expireAt: newTTL()});
      }
    });

// eslint-disable-next-line require-jsdoc
function newTTL() {
  const newDate = new Date();
  newDate.setHours(newDate.getHours() + 24);
  return newDate;
}

// eslint-disable-next-line require-jsdoc
function checkForWinner(board, winSize = 3) {
  // check horizontal
  let currentPlayer = "";
  let currentRun = 0;
  let x;
  let y;
  for (x = 0; x < board.length; x++) {
    currentPlayer = "";
    currentRun = 0;
    for (y = 0; y < board.length; y++) {
      // check for continuation
      if (board[y][x] !== "" && board[y][x] === currentPlayer) {
        currentRun++;
        if (currentRun === winSize) {
          // console.log("winner:")
          // console.log(currentRun)
          // console.log(currentPlayer)
          return currentPlayer;
        }
      } else {// switch to new player
        currentPlayer = board[y][x];
        currentRun = 1;
      }
    }
  }
  // check vertical
  for (y = 0; y < board.length; y++) {
    currentPlayer = "";
    currentRun = 0;
    for (x = 0; x < board.length; x++) {
      // check for continuation
      if (board[y][x] !== "" && board[y][x] === currentPlayer) {
        currentRun++;
        if (currentRun === winSize) {
          return currentPlayer;
        }
      } else {// switch to new player
        currentPlayer = board[y][x];
        currentRun = 1;
      }
    }
  }
  // check diagonal down right
  // start bottom left... start only when length possible
  // move to top right... stop when length impossible
  const calcDiagLength = (i) => { // calculate length of each diagonal
    if (i < board.length) {
      return i + 1;
    } else {
      return board.length * 2 - 1 - i;
    }
  };
  const calcDiagStartCoords = (i) => { // returns {x: ?, y: ?}
    if (i < board.length) {
      return {x: 0, y: board.length - 1 - i};
    } else {
      return {x: i - board.length - 2, y: 0};
    }
  };
  let i;
  let n;
  let diagStartCoords;
  let diagLength;
  for (i = winSize - 1; i < (board.length * 2 - 1 - (winSize - 1)); i++) {
    // each diagonal is numbered (starting with 0),
    // heres where to start and end.
    currentPlayer = "";
    currentRun = 0;
    diagStartCoords = calcDiagStartCoords(i);
    diagLength = calcDiagLength(i);
    for (n = 0; n < diagLength; n++) {
      console.log("-");
      console.log(diagStartCoords);
      console.log(n);
      // check for continuation
      x = diagStartCoords.x + n;
      y = diagStartCoords.y + n;
      if (board[y][x] !== "" && board[y][x] === currentPlayer) {
        currentRun++;
        if (currentRun === winSize) {
          return currentPlayer;
        }
      } else {// switch to new player
        currentPlayer = board[y][x];
        currentRun = 1;
      }
    }
  }
  // check diagonal up right
  // start top left...
  // end bottom right...
  const calcDiagUpStartCoords = (i) => { // returns {x: ?, y: ?}
    if (i < board.length) {
      return {x: 0, y: i};
    } else {
      return {x: i - board.length + 1, y: board.length - 1};
    }
  };
  console.log("diag/..");
  for (i = winSize - 1; i < (board.length * 2 - 1 - (winSize - 1)); i++) {
    // each diagonal is numbered (starting with 0),
    // heres where to start and end.
    currentPlayer = "";
    currentRun = 0;
    diagStartCoords = calcDiagUpStartCoords(i);
    diagLength = calcDiagLength(i);
    for (n = 0; n < diagLength; n++) {
      console.log("-");
      console.log(diagStartCoords);
      console.log(n);
      // check for continuation
      x = diagStartCoords.x + n;
      y = diagStartCoords.y - n;
      if (board[y][x] !== "" && board[y][x] === currentPlayer) {
        currentRun++;
        if (currentRun === winSize) {
          return currentPlayer;
        }
      } else {// switch to new player
        currentPlayer = board[y][x];
        currentRun = 1;
      }
    }
  }
}

// eslint-disable-next-line require-jsdoc
function createBoard(size) {
  // cannot store nested arrays in Firestore
  // so using strings of characters for inner ones
  const blank = "_";
  return [...Array(size)].map(() => blank.repeat(size));
}

// eslint-disable-next-line require-jsdoc
function getUid(idToken) {
  return admin.auth().verifyIdToken(idToken).then((decodedToken) => {
    console.log("decodedToken", decodedToken);
    return decodedToken.uid;
  }).catch((error) => {
    console.log(error);
  });
}

// eslint-disable-next-line require-jsdoc
function makeId(length) {
  let result = "";
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
