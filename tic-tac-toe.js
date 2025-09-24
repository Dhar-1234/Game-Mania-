const Player = Object.freeze({
    X: 0, O: 1
});

const GameState = Object.freeze({
    ONGOING: 0, DRAW: 1,
    LOSS_X: 2, LOSS_O: 3
});

let activePlayer = Player.X;
let gameState = GameState.ONGOING;

const ticTacToeSquares = document.getElementsByClassName("tic-tac-toe-square");
const boardState = [["NONE", "NONE", "NONE"],
                    ["NONE", "NONE", "NONE"],
                    ["NONE", "NONE", "NONE"]];

const xImage = document.getElementById("x-image");
const oImage = document.getElementById("o-image");

addEventListener("mousedown", e => {
    if (gameState != GameState.ONGOING) return;

    const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    const [squareIdx, isValidSquare] = isElementValidSquare(clickedElement);

    if (!isValidSquare) return;

    boardState[Math.floor(squareIdx / 3)][squareIdx % 3] = activePlayer == Player.X ? "X" : "O";
    placeXOrOAtSquare(clickedElement);

    gameState = getGameState();

    if (gameState == GameState.LOSS_O || gameState == GameState.LOSS_X)
        alert((activePlayer == Player.X ? "X" : "O") + " won!");
    else if (gameState == GameState.DRAW)
        alert("It's a draw");
    else activePlayer = activePlayer == Player.X ? Player.O : Player.X;
});

function placeXOrOAtSquare(element) {
    const _image = activePlayer == Player.X ? xImage.cloneNode(true) : oImage.cloneNode(true);
    _image.style.display = "inline";
    element.appendChild(_image);
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
