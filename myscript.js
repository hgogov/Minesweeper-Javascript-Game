var row = 10;
var col = 10;

var board, rows;
var mines = 20;
var minesPlanted = 0;
var boardDiv = document.getElementById("board");
var gameOverDiv = document.getElementById("gameOver");
var coordinatesToCheck = []; // array for pushing elements to be checked

startGame();

function startGame() {
    boardDiv.innerHTML = '';
    gameOverDiv.innerHTML = '';
    minesPlanted = 0;
    createGameBoard();
}

function gameOver() {
    uncoverMines();
    gameOverDiv.innerHTML = "<strong><h1>Game Over<h1></strong>";
}

function createGameBoard() {
    board = [];
    for (var i = 0; i < row; i++) {
        rows = []; // assign rows array which will contain cells

        for (var j = 0; j < col; j++) {
            var newCell = {
                isRevealed: false,
                isMine: false,
                mineCount: 0,
                element: {},
            };
            newCell.element = document.createElement('div'); // Create a <div></div> and store it in the cell object
            newCell.element.x = i; newCell.element.y = j; // set x and y for the separate cells
            var elem = document.createElement("img");
            elem.setAttribute("src", "cover_tile.png");
            newCell.element.appendChild(elem);
            newCell.element.setAttribute("onclick", "clickOnBoard(this.x, this.y)");
            boardDiv.appendChild(newCell.element); // Add it to the board
            rows.push(newCell);
        }
        board.push(rows);
    }
}

function uncoverMines() {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            if (board[i][j].isMine === true) {
                board[i][j].element.innerHTML = '<img src="mine.png">';
            }
            board[i][j].element.removeAttribute('onclick');
        }
    }
}

function plantMines() {
    minesPlanted = 0;

    while (minesPlanted < mines) {
        //get random x and y cooridinates
        var x = Math.floor(Math.random() * row);
        var y = Math.floor(Math.random() * col);
        if (board[x][y].isMine === false && !board[x][y].isRevealed) {
            board[x][y].isMine = true;
            minesPlanted++;
        }
    }
}

function clickOnBoard(x, y) {
    board[x][y].isRevealed = true;
    if (board[x][y].isMine) {
        gameOver();
    }
    else {
        if (minesPlanted === 0)
            plantMines();
        calculateMines(x, y);
    }
}

function calculateMines(x, y) {
    var coordCounter = 0; //counts the amount of times cell coordinates have been pushed in the toCheck array

    if ((x - 1) >= 0) { //check if it goes outside of board, it should stop here
        if (board[(x - 1)][y].isMine && !board[x - 1][y].isRevealed) {
            board[x][y].mineCount++;
        } else if (!board[x - 1][y].isRevealed && board[x][y].mineCount < 1) {
            coordinatesToCheck.push(x - 1, y); coordCounter++;
        }
    }
    if ((x + 1) < col) { //down
        if (board[(x + 1)][y].isMine && !board[x + 1][y].isRevealed) {
            board[x][y].mineCount++;;
        }
        else if (!board[x + 1][y].isRevealed && board[x][y].mineCount < 1) {
            coordinatesToCheck.push(x + 1, y); coordCounter++;
        }
    }
    if ((y + 1) < row) { //right
        if (board[x][y + 1].isMine && !board[x][y + 1].isRevealed) {
            board[x][y].mineCount++;
        }
        else if (!board[x][y + 1].isRevealed && board[x][y].mineCount < 1) {
            coordinatesToCheck.push(x, y + 1); coordCounter++;
        }
    }
    if ((y - 1) >= 0) { //left
        if (board[x][y - 1].isMine && !board[x][y - 1].isRevealed) {
            board[x][y].mineCount++;
        } else if (!board[x][y - 1].isRevealed && board[x][y].mineCount < 1) {
            coordinatesToCheck.push(x, y - 1); coordCounter++;
        }
    }
    if ((y - 1) >= 0 && (x - 1) >= 0) { //upper left
        if (board[x - 1][y - 1].isMine && !board[x - 1][y - 1].isRevealed) {
            board[x][y].mineCount++;
        } else if (!board[x - 1][y - 1].isRevealed && board[x][y].mineCount < 1) {
            coordinatesToCheck.push(x - 1, y - 1); coordCounter++;
        }
    }
    if ((y + 1) < row && (x - 1) >= 0) { //upper right
        if (board[x - 1][y + 1].isMine && !board[x - 1][y + 1].isRevealed) {
            board[x][y].mineCount++;
        } else if (!board[x - 1][y + 1].isRevealed && board[x][y].mineCount < 1) {
            coordinatesToCheck.push(x - 1, y + 1); coordCounter++;
        }
    }
    if ((y - 1) >= 0 && (x + 1) < col) { //bottom left
        if (board[x + 1][y - 1].isMine && !board[x + 1][y - 1].isRevealed) {
            board[x][y].mineCount++;
        } else if (!board[x + 1][y - 1].isRevealed && board[x][y].mineCount < 1) {
            coordinatesToCheck.push(x + 1, y - 1); coordCounter++;
        }
    }
    if ((y + 1) < row && (x + 1) < col) { //bottom right
        if (board[x + 1][y + 1].isMine && !board[x + 1][y + 1].isRevealed) {
            board[x][y].mineCount++;
        } else if (!board[x + 1][y + 1].isRevealed && board[x][y].mineCount < 1) {
            coordinatesToCheck.push(x + 1, y + 1); coordCounter++;
        }
    }


    if (coordinatesToCheck.length !== 0 && board[x][y].mineCount > 0) { //remove coordinates from array if current cell has adjacent mines
        coordinatesToCheck.splice(coordinatesToCheck.length - coordCounter * 2, coordCounter * 2);
    }

    board[x][y].element.innerHTML = board[x][y].mineCount;
    board[x][y].element.removeAttribute("onclick");
    board[x][y].isRevealed = true;
    if (coordinatesToCheck.length !== 0) {
        while (coordinatesToCheck.length !== 0) { //remove already revealed cells from array if the cell doesn't have adjacent mines
            if (board[coordinatesToCheck[0]][coordinatesToCheck[1]].isRevealed)
                coordinatesToCheck.splice(0, 2);
            else
                break;
        }
        if (coordinatesToCheck.length !== 0)
            calculateMines(coordinatesToCheck[0], coordinatesToCheck[1]);
    }
}