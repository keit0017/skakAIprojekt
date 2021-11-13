/**
 * This is the script file. All algorithms and AI is located in this file.
 * The chess.js file is the implementation of the chess rules.
 * 
 * Copyright (c) 2021 Jens Jensen & Keith Birongo
 */

var game = new Chess();

var config = {
  draggable: true,
  position: 'start',
};

var board = new Chessboard('board', config);