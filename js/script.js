/**
 * This is the script file. All algorithms and AI is located in this file.
 * The chess.js file is the implementation of the chess rules.
 * 
 * Copyright (c) 2021 Jens Jensen & Keith Birongo
 */

let game = new Chess();
//We need to initialize board otherwise we get error when called in precompile.
let board = null;
function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    // It checks whos turn it is and if the piece we try to move is the opposite color.
    if ((piece.search("/^w/") !== -1)) {
            return false;
        }
}

function onDrop(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: "q",
    });

    if (move === null) return 'snapback';

    //køre på sorts tur
    window.setTimeout(randomMove, 250)
}

function onSnapEnd() {
    board.position(game.fen())
}

function randomMove() {
    var newGameMoves = game.moves();
    // game over
    if (newGameMoves.length === 0) return

    var randomIdx = Math.floor(Math.random() * newGameMoves.length);

    var boardeval = evaluateBoard();
    console.log(boardeval);
    game.move(newGameMoves[randomIdx])
    board.position(game.fen())
};


//evaluering
const piecetoSquarevalues = {
    'p': pawnPieceSquareValues,
    'n': knightPieceSquareValues,
    'b': bishopPieceSquareValues,
    'r': rookPieceSquareValues,
    'q': queenPieceSquareValues,
    'k': kingPieceSquareValues,
};

const pieceValues = {
    'p': 100,
    'n': 320,
    'b': 330,
    'r': 500,
    'q': 900,
    'k': 20000,
};

const pawnPieceSquareValues = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

const knightPieceSquareValues = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
];

const bishopPieceSquareValues = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
];

const rookPieceSquareValues = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
];

const queenPieceSquareValues = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -2],
];

const kingPieceSquareValues = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 2],
]

const getCurrentPieceSquareValuation = (piece, x, y) => {
    const squares = piecetoSquarevalues[piece.type];
    return piece.color == 'w' ? squares[x][y] : squares[7 - x][y];
};

const getPieceEvaluation = (piece, x, y) =>{
    if (piece == null) {
        return 0; // tom celle

    } else {
        const getSquareValuation = ggetCurrentPieceSquareValuation(piece, x, y);
        const value = pieceValues[piece.type] + getSquareValuation;                 // piece value
        const mult = piece.color ? 1 : -1; // -ændre sig om spiller er hvis eller sort
        console.log("piecevaluation; "+value);
        return value * mult;
    }
};


function evaluateBoard(move) {
    let boardEvaluation = 0;

    var from = [
        8 - parseInt(move.from[1]),
        move.from.charCodeAt(0) - 'a'.charCodeAt(0),
    ];

    var to = [
        8 - parseInt(move.to[1]),
        move.to.charCodeAt(0) - 'a'.charCodeAt(0),
    ];

    if (game.in_checkmate()) {

        // Opponent is in checkmate (good for us)
        if (move.color === 'w') {
            return 10 ** 10;
        }
        // Our king's in checkmate (bad for us)
        else {
            return -(10 ** 10);
        }
    }

    if (game.in_draw() || game.in_threefold_repetition() || game.in_stalemate()) {
        return 0;
    }

    if (game.in_check()) {
        // Opponent is in check (good for us)
        if (move.color === 'w') {
            boardEvaluation += 50;
        }
        // Our king's in check (bad for us)
        else {
            boardEvaluation -= 50;
        }
    }

    //if we can promote good for us 



    // if captured the results yield this 

  
    return boardEvaluation;
};




let config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};

board = new Chessboard('board', config);