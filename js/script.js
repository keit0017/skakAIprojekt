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

const pieceWeight = {"p":100, "n":300, "b":300, "r": 500, "q":900, "k":10000};
const whitePositions = {
    "p":[
        [ 100, 100, 100, 100, 105, 100, 100,  100],
        [  78,  83,  86,  73, 102,  82,  85,  90],
        [   7,  29,  21,  44,  40,  31,  44,   7],
        [ -17,  16,  -2,  15,  14,   0,  15, -13],
        [ -26,   3,  10,   9,   6,   1,   0, -23],
        [ -22,   9,   5, -11, -10,  -2,   3, -19],
        [ -31,   8,  -7, -37, -36, -14,   3, -31],
        [   0,   0,   0,   0,   0,   0,   0,   0]
    ],
    "n": [ 
        [-66, -53, -75, -75, -10, -55, -58, -70],
        [ -3,  -6, 100, -36,   4,  62,  -4, -14],
        [ 10,  67,   1,  74,  73,  27,  62,  -2],
        [ 24,  24,  45,  37,  33,  41,  25,  17],
        [ -1,   5,  31,  21,  22,  35,   2,   0],
        [-18,  10,  13,  22,  18,  15,  11, -14],
        [-23, -15,   2,   0,   2,   0, -23, -20],
        [-74, -23, -26, -24, -19, -35, -22, -69]
    ],
    "b": [ 
        [-59, -78, -82, -76, -23,-107, -37, -50],
        [-11,  20,  35, -42, -39,  31,   2, -22],
        [ -9,  39, -32,  41,  52, -10,  28, -14],
        [ 25,  17,  20,  34,  26,  25,  15,  10],
        [ 13,  10,  17,  23,  17,  16,   0,   7],
        [ 14,  25,  24,  15,   8,  25,  20,  15],
        [ 19,  20,  11,   6,   7,   6,  20,  16],
        [ -7,   2, -15, -12, -14, -15, -10, -10]
    ],
    "r": [  
        [ 35,  29,  33,   4,  37,  33,  56,  50],
        [ 55,  29,  56,  67,  55,  62,  34,  60],
        [ 19,  35,  28,  33,  45,  27,  25,  15],
        [  0,   5,  16,  13,  18,  -4,  -9,  -6],
        [-28, -35, -16, -21, -13, -29, -46, -30],
        [-42, -28, -42, -25, -25, -35, -26, -46],
        [-53, -38, -31, -26, -29, -43, -44, -53],
        [-30, -24, -18,   5,  -2, -18, -31, -32]
    ],
    "q": [   
        [  6,   1,  -8,-104,  69,  24,  88,  26],
        [ 14,  32,  60, -10,  20,  76,  57,  24],
        [ -2,  43,  32,  60,  72,  63,  43,   2],
        [  1, -16,  22,  17,  25,  20, -13,  -6],
        [-14, -15,  -2,  -5,  -1, -10, -20, -22],
        [-30,  -6, -13, -11, -16, -11, -16, -27],
        [-36, -18,   0, -19, -15, -15, -21, -38],
        [-39, -30, -31, -13, -31, -36, -34, -42]
    ],
    "k": [  
        [  4,  54,  47, -99, -99,  60,  83, -62],
        [-32,  10,  55,  56,  56,  55,  10,   3],
        [-62,  12, -57,  44, -67,  28,  37, -31],
        [-55,  50,  11,  -4, -19,  13,   0, -49],
        [-55, -43, -52, -28, -51, -47,  -8, -50],
        [-47, -42, -43, -79, -64, -32, -29, -32],
        [ -4,   3, -14, -50, -57, -18,  13,   4],
        [ 17,  30,  -3, -14,   6,  -1,  40,  18]
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
            points += (pieceWeight[move.captured] + ourPosition[move.color][move.captured][to[0]][to[1]]);
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

function calcMove(player, game, sum) {
    const k = 3;

    let [move, value] = minmaxAlphaBeta(player,true,k,sum,game,Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    // const d = new Date().getTime();
    // const d2 = new Date().getTime();
    // console.log(d2-d);

    return [move, value];
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
    window.setTimeout(makeMove("b"), 250)
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