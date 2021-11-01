const X = '&#10006;';
const O = 'O';
let turn = X;
let board = new Array(9);
const cells = document.querySelectorAll(".board-cell");
const winnerDash = document.querySelector('#board-winner-dash');
const player1 = document.querySelector('#player-1 .player-score');
const player2 = document.querySelector('#player-2 .player-score');

let player = {
    X: 'Human',
    O: 'PC',
    X_S: 0,
    O_S: 0
}

class Score {
    constructor(index, score) {
        this.index = index;
        this.score = score;
    }
}

// Utility functions
function reset() {
    turn = X;
    board = new Array(9);
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('board-cell-x', 'board-cell-o');
    });
    winnerDash.className = '';
}

function changeTurn() {
    turn = (turn === X) ? O : X;
}

function nextTurn() {
    return (turn === X) ? O : X;
}

function isFull() {
    for (let i = 0; i < 9; i++) {
        if (board[i] === undefined) {
            return false;
        }
    }
    return true;
}

function checkWinner() {
    for (let i = 0; i < 3; i++) {
        if (board[i * 3] === board[i * 3 + 1]
            && board[i * 3 + 1] === board[i * 3 + 2]
            && board[i * 3+  2] !== undefined) {
            return board[i * 3];
        } else if (board[i] === board[i + 3]
            && board[i + 3] === board[i + 6]
            && board[i + 6] !== undefined) {
            return board[i];
        }
    }

    if (((board[0] === board[4] && board[4] === board[8])
        || (board[2] === board[4] && board[4] === board[6]))
        && board[4] !== undefined) {
        return board[4];
    } else if (isFull()) {
        return 'Draw';
    }
    return 'nil';
}


// The minimax algorithm for hardest move in the tic tae toe
function minimax(b, isMax) {
    let winner = checkWinner();
    if (winner === turn) {
        return new Score(0, 10);
    } else if (winner === nextTurn()) {
        return new Score(0, -10);
    } else if (winner === 'Draw') {
        return new Score(0, 0);
    }

    let tempScore = new Score(-1, isMax ? -Infinity : Infinity);

    for (let i = 0; i < 9; i++) {
        if (b[i] === undefined) {
            b[i] = (isMax) ? turn : nextTurn();
            let currentScore = minimax(b, !isMax);
            if (isMax && currentScore.score > tempScore.score) {
                tempScore.index = i;
                tempScore.score = currentScore.score - 1;
            } else if (!isMax && currentScore.score < tempScore.score) {
                tempScore.index = i;
                tempScore.score = currentScore.score - 1;
            }
            b[i] = undefined;
        }
    }
    return tempScore;
}


function nextMove() {
    let winner;
    let cellPC;
    if ((winner = checkWinner()) === 'nil') {
        if (turn === X && player.X === 'PC') {
            setTimeout(() => {
                let pcTurn = minimax(board, true);
                console.log(pcTurn);
                board[pcTurn.index] = turn;
                cellPC = cells.item(pcTurn.index);
                cellPC.classList.add('board-cell-x');
                cellPC.innerHTML = turn;
                changeTurn();
                nextMove();
            }, 500);
        } else if (turn === O && player.O === 'PC') {
            setTimeout(() => {
                let pcTurn = minimax(board, true);
                console.log(pcTurn);
                board[pcTurn.index] = turn;
                cellPC = cells.item(pcTurn.index);
                cellPC.classList.add('board-cell-o');
                cellPC.innerHTML = turn;
                changeTurn();
                nextMove();
            }, 500);
        }
    } else {
        if (winner !== 'Draw') {
            winnerDash.classList.add('board-winner-dash-visible');
            if (board[0] === board[1] && board[1] === board[2] && board[0] === winner)
                winnerDash.classList.add('board-winner-dash-h1', 'board-winner-dash-vh');
            else if (board[3] === board[4] && board[4] === board[5] && board[3] === winner)
                winnerDash.classList.add('board-winner-dash-h2', 'board-winner-dash-vh');
            else if (board[6] === board[7] && board[7] === board[8] && board[6] === winner)
                winnerDash.classList.add('board-winner-dash-h3', 'board-winner-dash-vh');
            else if (board[0] === board[3] && board[3] === board[6] && board[0] === winner)
                winnerDash.classList.add('board-winner-dash-v1', 'board-winner-dash-vh');
            else if (board[1] === board[4] && board[4] === board[7] && board[1] === winner)
                winnerDash.classList.add('board-winner-dash-v2', 'board-winner-dash-vh');
            else if (board[2] === board[5] && board[5] === board[8] && board[2] === winner)
                winnerDash.classList.add('board-winner-dash-v3', 'board-winner-dash-vh');
            else if (board[0] === board[4] && board[4] === board[8] && board[4] === winner)
                winnerDash.classList.add('board-winner-dash-d1');
            else if (board[2] === board[4] && board[4] === board[6] && board[4] === winner)
                winnerDash.classList.add('board-winner-dash-d2');

            if (winner === X) {
                player.X_S += 1;
                player1.innerHTML = '' + player.X_S;
            } else {
                player.O_S += 1;
                player2.innerHTML = '' + player.O_S;
            }
        }
        console.log(winner);
        setTimeout(() => {
            reset();
        }, 1500);
    }
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (cell.innerHTML === '' && checkWinner() === 'nil') {
            if (turn === X) {
                cell.classList.add('board-cell-x');
            } else {
                cell.classList.add('board-cell-o');
            }
            cell.innerHTML = board[index] = turn;
            changeTurn();
        }
        console.log(board);
        nextMove();
    })
})

nextMove();