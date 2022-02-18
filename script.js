// Module for the board data. Creates board DOM element.
let gameBoard = (() => {
  let board = [];
  // Check if game is solo.
  let AIonline = false;
  const length = 9;
  const displayBoard = () => {
    // Creates a DOM element for every square of the board.
    const boardDOM = document.getElementById("board")
    for (let i = 0; i < length; i++) {
      const square = document.createElement("div");   
      square.setAttribute("class", "square");
      square.setAttribute("id", `${i}`);
      square.style.setProperty("flex-basis", `${100/3}%`)
      boardDOM.appendChild(square);   
    }
  }
  // Adds click event to grids of the board.
  const addGridClick = () => {
    for (let i = 0; i < length; i++) {
      const gridDOM = document.getElementById(`${i}`)
      gridDOM.addEventListener("click", addMark, false)
    }
  }
  return {
    board,
    length,
    displayBoard,
    addGridClick,
    AIonline
  }  
})()

// Stores winning arrays.
const winningArrays = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

// Displays the board.
gameBoard.displayBoard()

// Functions that remove click events and resets the game.
let reset = (() => {
  // Removes click events from player selection when match is in progress.
  const playerSettings = () => {
    // document.getElementById("1player").removeEventListener("click")
    document.getElementById("2players").removeEventListener("click", twoPlayerGame, false)
  }
  // Resets players and turns.
  const players = () => {
    player1 = {}
    player2 = {}
    currentPlayer = ""
    // Removes turn/winner messages.
    turn.DOM = ""
  }
  // Resets board.
  const board = () => {
    gameBoard.board = []
    for (let i = 0; i < gameBoard.length; i++) {
      document.getElementById(`${i}`).removeEventListener("click", addMark, false)
    }
  }

  // Restores player settings.
  const restoreSettings = () => {
    // Adds event to twoPlayers button. Calls twoPlayerGame.
    const twoPlayers = document.getElementById("2players")
    twoPlayers.addEventListener("click", twoPlayerGame, false)
    // Adds event to onePlayer button. Calls soloGame.
    const onePlayer = document.getElementById("1player")
    onePlayer.addEventListener("click", soloGame, false)
  }

  // Removes click events from board when match is over.
  const grid = () => {
    for (let i = 0; i < length; i++) {
      const gridDOM = document.getElementById(`${i}`)
      gridDOM.removeEventListener("click", addMark, false)
    }
  }

  // Resets game after a match.
  const game = () => {
    players();
    board();
    restoreSettings();
    gameBoard.AIonline = false
    gameBoard.addGridClick()
  }

  // Adds click even to restart button. Calls reset.game.
  document.getElementById("restart").addEventListener("click", game, false)

  return {
    playerSettings,
    restoreSettings,
    grid
  }
})()

// Allows for player options.
reset.restoreSettings()

// Factory for players.
const Player = (name, mark) => {
  let markedBoard = []
  const getMark = () => mark
  const getName = () => name
  return {markedBoard, getMark, getName}
}

// Declare global current player.
let currentPlayer = ""
// Declare players
let player1 = {}
let player2 = {}

// Initializes players, turns and board for solo play.
function soloGame() {
  gameBoard.AIonline = true;
  // Prompts for players' names and their marks.
  let player1Name = prompt("Enter player one's name (special characters excluded).")
  while (player1Name == "" || !isAlphaNumeric(player1Name)) {
    player1Name = prompt("Enter player one's name (special characters excluded).")
  }

  let player1Mark = prompt("Would you like to be X or O?").toUpperCase()
  while (player1Mark != "X" && player1Mark != "O") {
    player1Mark = prompt("Would you like to be X or O?").toUpperCase()
  }

  let player2Name = "The Computer"
  let player2Mark = ""
  player2Mark = (player1Mark == "X")? "O" : "X"; 

  player1 = Player(player1Name, player1Mark)
  player2 = Player(player2Name, player2Mark)

  // Calls for gameBoard.addGridClick.
  gameBoard.addGridClick();
  // Displays turn.
  turn.displayTurn();
}

// Initializes players, turns and board for 2-persons play.
function twoPlayerGame() {
  // Prompts for players' names and their marks.
  let player1Name = prompt("Enter player one's name (special characters excluded).")
  console.log(player1Name)
  while (player1Name == "" || !isAlphaNumeric(player1Name)) {
    player1Name = prompt("Enter player one's name (special characters excluded).")
  }

  let player1Mark = prompt("Would you like to be X or O?").toUpperCase()
  while (player1Mark != "X" && player1Mark != "O") {
    player1Mark = prompt("Would you like to be X or O?").toUpperCase()
  }

  let player2Name = prompt("Enter player two's name (special characters excluded).")
  while (player2Name == "" || !isAlphaNumeric(player2Name)) {
    player2Name = prompt("Enter player two's name (special characters excluded).")
  }
  let player2Mark = ""
  player2Mark = (player1Mark == "X")? "O" : "X"; 

  player1 = Player(player1Name, player1Mark)
  player2 = Player(player2Name, player2Mark)

  // Calls for gameBoard.addGridClick.
  gameBoard.addGridClick();

  // Displays turn.
  turn.displayTurn();

  // Removes player options while game is in progress.
  reset.playerSettings()
}

// Determines who plays first and turn order. Updates current player variable.
let turn = (() => {
  const DOM = document.getElementById("playerTurn")
  const displayTurn = () => {
    // Checks if player1 is registered.
    if (!(Object.keys(player1).length === 0)) {
      for(let i = 0; i < gameBoard.length; i++) {
        // Checks if board is empty.
        if (gameBoard.board.length === 0)
        {
          // Randomizes first player.
          let first = Math.floor(Math.random() * 2) + 1;
          if (first == 1) { currentPlayer = player1 } else { currentPlayer = player2 }
          DOM.textContent = `${currentPlayer.getName()} will go first`
          if (gameBoard.AIonline && currentPlayer == player2) {
            AIturn();
          }
        }
      }
    }
  }
  const current = () => {
    // Regular turns.
    // Checks for winner.
    // An endstate of the board is reached.
    let results = checkWinner()
    if (results != undefined) {
      if (Math.abs(results) == 1) {
        turn.DOM.textContent = `${currentPlayer.getName()} wins!`
        reset.grid()
        return
      }
      else {turn.DOM.textContent = "Tie! Nobody wins!"}
      reset.grid()
      return
    }
    if (currentPlayer == player1) { 
      currentPlayer = player2 
      if (gameBoard.AIonline) {
        AIturn();
      }
    } 
    else {
     currentPlayer = player1 
    }
    DOM.textContent = `${currentPlayer.getName()}'s turn`
  }
  return {currentPlayer, displayTurn, current, DOM}
})()

// 

// Adds mark to board and edits each players current marks on the board.
function addMark() {
  if (this.textContent == "") {
    const grid = this.id
    // Updates board in gameBoard module
    gameBoard.board[grid] = currentPlayer.getMark()
    // Updates board DOM element.
    this.textContent = `${currentPlayer.getMark()}`
    currentPlayer.markedBoard.push(grid)
    // Displays who plays next turn.
    turn.current()
  }
}

// Check for winner or a tie.
function checkWinner() {
  for (let i = 0; i < 8; i++) {
    const youWin = winningArrays[i].every(element => {
      return currentPlayer.markedBoard.sort().includes(String(element));
    })
    if (youWin) {
      if (currentPlayer == player1) {
        return -1
      }
      else {return 1}
    }
  }
  if ((player1.markedBoard + player2.markedBoard) == 9) {
    return 0
  }
}


// Checks if input is aphanumeric.
function isAlphaNumeric(str) {
  for (let i = 0; i < str.length; i++) {
    let strcode = str.charCodeAt(i);
    if (!(strcode > 47 && strcode < 58) && // numeric (0-9)
        !(strcode > 64 && strcode < 91) && // upper alpha (A-Z)
        !(strcode > 96 && strcode < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
}

// AI turn
function AIturn() {
  const grid = document.getElementById(`${bestMove()}`)
  grid.click()
}


// Minimax
function bestMove() {
  let bestScore = -Infinity
  let bestMove;
  for (i = 0; i < gameBoard.length; i++) {
    // Empty grid.
    if (gameBoard.board[i] == undefined) {
      player2.markedBoard.push(`{i}`)
      let score = minimax(false)
      player2.markedBoard.pop()
      if (score > bestScore) {
        bestMove = `${i}`
      }
    }
  }
  return bestMove
}

function minimax(isMaximizing) {
  // Check if last move ends the game.
  let results = checkWinner()
  console.log(player2.markedBoard)
  console.log(player1.markedBoard)
  if (results != undefined) {
    return results
  }
  if (isMaximizing) {
    let bestScore = -Infinity
    for (i = 0; i < gameBoard.length; i++) {
      // Empty grid.
      if (gameBoard.board[i] == undefined) {
        player2.markedBoard.push(`${i}`)
        gameBoard.board[i] = player2.getMark()
        let score = minimax(false)
        gameBoard.board[i] = undefined
        player2.markedBoard.pop()
        if (score > bestScore) {
          bestScore = Math.max(score, bestScore)
        }
      }
    }
    return bestScore
  }
  else {
    let bestScore = Infinity
    for (i = 0; i < gameBoard.length; i++) {
      // Empty grid.
      if (gameBoard.board[i] == undefined) {
        player1.markedBoard.push(`${i}`)
        gameBoard.board[i] = player1.getMark()
        let score = minimax(true)
        gameBoard.board[i] = undefined
        player1.markedBoard.pop()
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore
  }
}

// Things to do: remove markedboards. use board to make 2 arrays for each player in check winner. 
// check player1, then player2 and return value