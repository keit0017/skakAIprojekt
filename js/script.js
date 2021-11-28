/**
 * This is the script file. All algorithms and AI is located in this file.
 * The chess.js file is the implementation of the chess rules.
 * 
 * Copyright (c) 2021 Jens Jensen & Keith Birongo
 */

const game = new Chess();
//We need to initialize board otherwise we get error when called in precompile.
let board = null;
let countPos;
let totalSum = 0;

let config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
  };


board = new Chessboard('board', config);

const pieceWeight = {"p":80, "n":300, "b":300, "r": 500, "q":900, "k":10000};

const whitePositions = {
    "p":[
        [ 10, 10, 10, 10, 10, 10, 10,  10],
        [ 50, 50, 50, 50, 50, 50, 50, 50],
        [ 10, 10, 20, 30, 30, 20, 10, 10,],
        [ 5,  5, 10, 25, 25, 10,  5,  5,],
        [  0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [ 5, 10, 10,-20,-20, 10, 10,  5],
        [  0,  0,  0,  0,  0,  0,  0,  0]
    ],
    "n": [ 
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [ -40,-20,  0,  0,  0,  0,-20,-40],
        [ -30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50,]
    ],
    "b": [ 
        [20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [ -10,  5,  5, 10, 10,  5,  5,-10],
        [ -10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [ -20,-10,-10,-10,-10,-10,-10,-20,]
    ],
    "r": [  
        [ 0,  0,  0,  5,  5,  0,  0,  0],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0,]
    ],
    "q": [   
        [ -20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [  0,  0,  5,  5,  5,  5,  0, -5,],
        [-5,  0,  5,  5,  5,  5,  0, -5,],
        [10,  0,  5,  5,  5,  5,  0,-10],
        [-10,  0,  0,  0,  0,  0,  0,-10,],
        [-20,-10,-10, -5, -5,-10,-10,-20,]
    ],
    "k": [  
        [  -30,  -40,  -40, -50, -50,  -40,  -40, -30],
        [-30,  -40,  -55,  -56,  -56,  -55,  -40,   -30],
        [-30,  -40, -57,  -44, -50,  -28,  -40, -31],
        [-40,  -40,  -11,  -44, -44,  -40,   -40, -30],
        [-20, -30, -52, -28, -51, -47,  -30, -20],
        [-10, -20, -20, -20, -20, -20, -20, -10],
        [ 20,  20, 0, 0, 0, 0,  20,   20],
        [ 20,  30, 10, 0,   0,  10,  30,  20]
    ],
    // The kings table changes according to the game state
    "k_e": [
        [-50, -40, -30, -20, -20, -30, -40, -50],
        [-30, -20, -10,   0,   0, -10, -20, -30],
        [-30, -10,  20,  30,  30,  20, -10, -30],
        [-30, -10,  30,  40,  40,  30, -10, -30],
        [-30, -10,  30,  40,  40,  30, -10, -30],
        [-30, -10,  20,  30,  30,  20, -10, -30],
        [-30, -30,   0,   0,   0,   0, -30, -30],
        [-50, -30, -30, -30, -30, -30, -30, -50]
    ]
};
// We are reversing whites position weights on the board and give it to black
const blackPositions = {
    "p": whitePositions["p"].slice().reverse(),
    "n": whitePositions["n"].slice().reverse(),
    "b": whitePositions["b"].slice().reverse(),
    "r": whitePositions["r"].slice().reverse(),
    "q": whitePositions["q"].slice().reverse(),
    "k": whitePositions["k"].slice().reverse(),
    "k_e": whitePositions["k_e"].slice().reverse()
};

const ourPosition = {"w": whitePositions, "b": blackPositions};
const enemyPosition = {"b": blackPositions, "w": whitePositions}
// This function will evaluate the current game state for current player.
// It takes into account the above statet board tables and piece weights.
function evalFunc(move, points, player, game){
    
    if(game.in_checkmate()){
        if(move.color === player) {
            return 10 ** 10;
        } else {
            return -(10 ** 10);
        }
    }
    
    if (game.in_draw() || game.in_threefold_repetition() || game.in_stalemate()){
        return 0;
    }

    if (game.in_check()){
        if(move.color === player){
            points += 50;
        } else {
            points -= 50;
        }
    }

    const from = [8 - parseInt(move.from[1]), move.from.charCodeAt(0) - "a".charCodeAt(0)];
    const to = [8 - parseInt(move.to[1]), move.to.charCodeAt(0) - "a".charCodeAt(0)];
    // if the state of the game is endgame then we change the kings board table.
    if(points < -1500){
        if(move.piece === "k") move.piece = "k_e";
        else if(move.captured === "k") move.captured = "k_e";
    }
    // We check if there is any captured pieces in our moves.
    if("captured" in move){
        if(move.color === player){
            points += (pieceWeight[move.captured] + enemyPosition[move.color][move.captured][to[0]][to[1]]);
        } else {
            points -= (pieceWeight[move.captured] + ourPosition[move.color][move.captured][to[0]][to[1]]);
        }
    }
    // Check if the piece can be promoted
    if(move.flags.includes("p")){
        move.promotion = "q";
        if(move.color === player){
            points -= (pieceWeight[move.piece] + ourPosition[move.color][move.piece][from[0]][from[1]]);
            points += (pieceWeight[move.promotion] + ourPosition[move.color][move.promotion][to[0]][to[0]]);
        } else {
            points += (pieceWeight[move.piece] + ourPosition[move.color][move.piece][from[0]][from[1]]);
            points -= (pieceWeight[move.promotion] + ourPosition[move.color][move.promotion][to[0]][to[0]]);
        }
    // If piece not captured or promoted then it still exist and we need to update position.
    } else {
        if(move.color !== player){
            points += ourPosition[move.color][move.piece][from[0]][from[1]];
            points -= ourPosition[move.color][move.piece][to[0]][to[1]];
        } else {
            points -= ourPosition[move.color][move.piece][from[0]][from[1]];
            points += ourPosition[move.color][move.piece][from[0]][from[1]];
        }
    }


    return points;
};


function minmaxAlphaBeta(player, maximize, k, sum, game, alpha, beta){
    countPos++;
    let childNodes = game.ugly_moves({verbose: true});

    childNodes.sort(function(a, b){return 0.5 - Math.random()});

    if(k === 0 || childNodes.length === 0){
        return [null, sum];
    }

    let bestMove;
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;

    for(let i = 0; i < childNodes.length; i++){

        child = childNodes[i];
        let prettyMove = game.ugly_move(child);
        let evalSum = evalFunc(prettyMove, sum, player, game);
        let [childBest, childVal] = minmaxAlphaBeta(player, !maximize, k-1, evalSum, game, alpha, beta);

        game.undo();

        if(maximize){
            if (childVal > max){
                max = childVal;
                bestMove = prettyMove;
            }
            if(childVal > alpha){
                alpha = childVal;
            }
        } else {
            if (childVal < min){
                min = childVal;
                bestMove = prettyMove;
            }
            if ( childVal < beta){
                beta = childVal;
            }
        }
        if(alpha >= beta){
            break;
        }
    }
    if(maximize){
        return [bestMove, max];
    } else {
        return [bestMove, min];
    }
}

var startTime, endTime;

function calcMove(player, game, sum) {
    const maxvalue = 5;
    let startvalue = 1;
    let timeElapsed = 0;
    let moves =[];
    const maxtime =6000;

    // iterative deepening 
    startTimer();
    while(timeElapsed<=maxtime){
    let [move, value] = minmaxAlphaBeta(player,true,startvalue,sum,game,Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    moves= [move, value];
    startvalue +=1;
    console.log(startvalue+"this is the current depth");

    if(startvalue == maxvalue){
        return moves;
    }

    timeElapsed =endTimer();
    }   
    endTimer()
    return moves;
}



function startTimer() {
  startTime = performance.now();
  console.log(startTime + " :starttime");
};

function endTimer() {
  endTime = performance.now();
  var timeDiff = endTime - startTime; 
  console.log(timeDiff + " :milliseconds sincemove");
  return timeDiff;
}

function makeMove(player) {
    let move = calcMove(player, game, totalSum)[0];

    totalSum = evalFunc(move,totalSum,"b", game);

    game.move(move);
    board.position(game.fen());

}

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    // It checks whos turn it is and if the piece we try to move is the opposite color.
    // In our case we only check if the piece is white, because the AI is always black.
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

    totalSum = evalFunc(move, totalSum, "b", game);

    //This runs on blacks turn.
    window.setTimeout(makeMove("b"), 250);
}

function onSnapEnd() {
    board.position(game.fen())
}

function randomMove() {
    let newGameMoves = game.moves();
    // Game over
    if (newGameMoves.length === 0) return false;

    let randomIdx= Math.floor(Math.random() * newGameMoves.length);
    game.move(newGameMoves[randomIdx]);
    board.position(game.fen());
};