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
    if ((game.turn() === "w" && piece.search("/^b/") !== -1) || 
        (game.turn() === "b" && piece.search("/^w/") !== -1)) {
            return false;
        }
}

function onDrop(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: "q",
    });

    if (move === null) return false;
}

function onSnapEnd() {
    board.position(game.fen())
}

let config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};

board = new Chessboard('board', config);