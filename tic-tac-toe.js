const Player = Object.freeze({
    X: 0, O: 1
});

const GameState = Object.freeze({
    ONGOING: 0, DRAW: 1,
    LOSS_X: 2, LOSS_O: 3
});

let activePlayer = Player.X;
let aiPlayer = Math.random() < 0.5 ? Player.X : Player.O;
let gameState = GameState.ONGOING;

const ticTacToeSquares = document.getElementsByClassName("tic-tac-toe-square");
const boardState = [["NONE", "NONE", "NONE"],
["NONE", "NONE", "NONE"],
["NONE", "NONE", "NONE"]];

const xImage = document.getElementById("x-image");
const oImage = document.getElementById("o-image");
const gameStatus = document.getElementById("game-status");

if (aiPlayer == Player.X) {
    boardState[1][1] = 'X';
    gameStatus.textContent = "AI's turn...";

    setTimeout(() => {
        placeXOrOAtSquare(rowColToSquareElement(1, 1));
        activePlayer = Player.O;
        updateGameStatusText();
    }, Math.random() * 500 + 200);
}

addEventListener("mousedown", e => {
    if (gameState != GameState.ONGOING) return;
    if (activePlayer == aiPlayer) return;

    const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    const [squareIdx, isValidSquare] = isElementValidSquare(clickedElement);

    if (!isValidSquare) return;

    boardState[Math.floor(squareIdx / 3)][squareIdx % 3] = activePlayer == Player.X ? "X" : "O";
    placeXOrOAtSquare(clickedElement);

    gameState = getGameState();

    if (gameState == GameState.LOSS_O || gameState == GameState.LOSS_X)
        alert("You won!");
    else if (gameState == GameState.DRAW)
        alert("It's a draw");

    else {
        activePlayer = activePlayer == Player.X ? Player.O : Player.X;
        updateGameStatusText();

        makeAIMove();

        gameState = getGameState();
        if (gameState == GameState.LOSS_O || gameState == GameState.LOSS_X)
            alert("You lost...");
        else if (gameState == GameState.DRAW)
            alert("It's a draw");
    }
});

function rowColToSquareElement(row, col) {
    const rowStr = row == 0 ? "top" : (row == 1 ? "middle" : "bottom");
    const colStr = col == 0 ? "left" : (col == 1 ? "middle" : "right");
    return document.getElementById(`${rowStr}-${colStr}`);
}

function placeXOrOAtSquare(element) {
    const img = activePlayer == Player.X ? xImage.cloneNode(true) : oImage.cloneNode(true);
    img.style.display = "inline";
    element.appendChild(img);
}

function isElementValidSquare(element) {
    if (element == null) return [-1, false];

    let isGameSquare = false;
    let index = 0;
    for (; index < ticTacToeSquares.length; index++) {
        if (element == ticTacToeSquares[index]) {
            isGameSquare = true;
            break;
        }
    }

    if (!isGameSquare) return [-1, false];

    if (boardState[Math.floor(index / 3)][index % 3] != "NONE") return [-1, false];

    return [index, true];
}

function getGameState() {
    if (didPlayerWin(Player.X)) return GameState.LOSS_O;
    if (didPlayerWin(Player.O)) return GameState.LOSS_X;

    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            if (boardState[row][column] === "NONE") return GameState.ONGOING;
        }
    }

    return GameState.DRAW;
}

function didPlayerWin(player) {
    let playerString = player == Player.X ? "X" : "O";

    // checking each row
    for (let row = 0; row < 3; row++) {
        let numInRow = 0;
        for (let column = 0; column < 3; column++) {
            if (boardState[row][column] === playerString) numInRow++;
        }

        if (numInRow == 3) return true;
    }

    // checking each column
    for (let column = 0; column < 3; column++) {
        let numInColumn = 0;
        for (let row = 0; row < 3; row++) {
            if (boardState[row][column] === playerString) numInColumn++;
        }

        if (numInColumn == 3) return true;
    }

    // checking diagonal from top left to bottom right
    let numInDiagonal = 0;
    for (let i = 0; i < 3; i++) {
        if (boardState[i][i] == playerString) numInDiagonal++;
    }

    if (numInDiagonal == 3) return true;

    // checking diagonal from bottom left to top right
    numInDiagonal = 0;
    for (let i = 0; i < 3; i++) {
        if (boardState[2 - i][i] == playerString) numInDiagonal++;
    }

    if (numInDiagonal == 3) return true;

    return false;
}

function updateGameStatusText() {
    if (gameState == GameState.ONGOING) {
        if (activePlayer == aiPlayer)
            gameStatus.textContent = "AI's turn...";
        else
            gameStatus.textContent = "Your turn!";
    }

    else if (gameState == GameState.DRAW)
        gameStatus.textContent = "It's a draw!";
    else if (gameState == GameState.LOSS_O && aiPlayer == Player.O)
        gameStatus.textContent = "You won!";
    else if (gameState == GameState.LOSS_X && aiPlayer == Player.X)
        gameStatus.textContent = "You won!";
    else gameStatus.textContent = "You lost...";
}

function makeAIMove() {
    let [row, column] = findBestAIMove();
    boardState[row][column] = aiPlayer == Player.X ? "X" : "O";

    setTimeout(() => {
        placeXOrOAtSquare(rowColToSquareElement(row, column));
        activePlayer = activePlayer == Player.X ? Player.O : Player.X;

        gameState = getGameState();
        updateGameStatusText();
    }, Math.random() * 500 + 200);
}

function miniMax() {
    let state = getGameState();
    if (state == GameState.DRAW) return 0;

    if (activePlayer === Player.X) {
        if (state == GameState.LOSS_O) return Infinity;
        if (state == GameState.LOSS_X) return -Infinity;
    }

    else {
        if (state == GameState.LOSS_X) return Infinity;
        if (state == GameState.LOSS_O) return -Infinity;
    }

    let bestValue = -Infinity;
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            if (boardState[row][column] !== "NONE")
                continue;

            boardState[row][column] = activePlayer == Player.X ? "X" : "O";
            activePlayer = activePlayer == Player.X ? Player.O : Player.X;
            bestValue = Math.max(bestValue, -miniMax());

            boardState[row][column] = "NONE";
            activePlayer = activePlayer == Player.X ? Player.O : Player.X;
        }
    }

    return bestValue;
}

function findBestAIMove() {
    let bestMove = [-1, -1];
    let bestValue = -Infinity;
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            if (boardState[row][column] !== "NONE")
                continue;

            boardState[row][column] = aiPlayer == Player.X ? "X" : "O";
            activePlayer = activePlayer == Player.X ? Player.O : Player.X;

            const res = -miniMax();
            if (res >= bestValue) {
                bestValue = res;
                bestMove = [row, column];
            }

            boardState[row][column] = "NONE";
            activePlayer = activePlayer == Player.X ? Player.O : Player.X;
        }
    }

    return bestMove;
}
