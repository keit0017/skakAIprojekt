var board = null;
var $board = $('#board');
var game = new Chess();
var globalSum = 0; // This is set from the black pieces perspective.
var whiteSquareGrey = '#a9a9a9';
var blackSquareGrey = '#696969';

var squareClass = 'square-55d63';
var squareToHighlight = null;
var colorToHighlight = null;
var positionCount;

var config = {
  draggable: true,
  position: 'start',
};
var board = new Chessboard('board', config);