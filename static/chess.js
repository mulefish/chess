const PAWN_B = "♟";
const ROOK_B = "♜";
const KNIGHT_B = "♞";
const BISHOP_B = "♝";
const QUEEN_B = "♛";
const KING_B = "♚";
const ROOK_W = "♖";
const KNIGHT_W = "♘";
const BISHOP_W = "♗";
const QUEEN_W = "♕";
const KING_W = "♔";
const PAWN_W = "♙"; 
const BLACK = "black";
const WHITE = "white";

function getPossibleMoveArrays(icon) {
    switch (icon) {
      case KNIGHT_B:
        return [
          [-2, -1], [-2, 1],
          [-1, -2], [-1, 2],
          [1, -2], [1, 2],
          [2, -1], [2, 1],
        ];
      case ROOK_B:
        return [[-1, 0], [1, 0], [0, -1], [0, 1]];
      case BISHOP_B:
        return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      case QUEEN_B:
        return [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
      case KING_B:
        return [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
      case PAWN_B:
        return [[0, 1]];
      case ROOK_W:
        return [[-1, 0], [1, 0], [0, -1], [0, 1]];
      case BISHOP_W:
        return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      case QUEEN_W:
        return [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
      case KING_W:
        return [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
      case PAWN_W:
        return [[0, -1]];
  
      default:
        return [];
    }
  }


class Piece {
    constructor(key, color, icon, row, col, recurseDepth) {
        this.key = key 
        this.color = color
        this.icon = icon
        this.row = row;
        this.col = col;
        this.recurseDepth
        this.moves = getPossibleMoveArrays(icon)
    }

    placeOnBoard() {
        const cellId = `${this.row}-${this.col}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.innerHTML = "<span class='chess-piece'>" + this.icon + "</span>";
            cell.piece = this;
        } else {
            console.log(`Cell with id ${cellId} not found`);
        }
    }
}

// Function to add click event listeners to each cell
function addClickListeners() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.piece) {
                console.log(`YAY Clicked on cell: ${cell.id}, Piece: ${cell.piece.icon} key: ${cell.piece.key}`);
            } else {
                // console.log(`BOO Clicked on cell: ${cell.id}`);
            }
        });
    });
}
function getPieces() {
let p = {} 
p['rb1'] = new Piece('rb1', BLACK, ROOK_B,   0, 0,  8);
p['nb1'] = new Piece('nb1', BLACK, KNIGHT_B, 0, 1,  1);
p['bb1'] = new Piece('bb1', BLACK, BISHOP_B, 0, 2,  8);
p['qb']  = new Piece('qb',  BLACK, QUEEN_B,  0, 3,  8);
p['kb']  = new Piece('kb',  BLACK, KING_B,   0, 4,  1);
p['bb2'] = new Piece('bb2', BLACK, BISHOP_B, 0, 5,  8);
p['nb2'] = new Piece('nb2', BLACK, KNIGHT_B, 0, 6,  1);
p['rb2'] = new Piece('rb2', BLACK, PAWN_B,   0, 7,  8);
p['pb1'] = new Piece('pb1', BLACK, PAWN_B,   1, 0,  2);
p['pb2'] = new Piece('pb2', BLACK, PAWN_B,   1, 1,  2);
p['pb3'] = new Piece('pb3', BLACK, PAWN_B,   1, 2,  2);
p['pb4'] = new Piece('pb4', BLACK, PAWN_B,   1, 3,  2);
p['pb5'] = new Piece('pb5', BLACK, PAWN_B,   1, 4,  2);
p['pb6'] = new Piece('pb6', BLACK, PAWN_B,   1, 5,  2);
p['pb7'] = new Piece('pb7', BLACK, PAWN_B,   1, 6,  2);
p['pb8'] = new Piece('pb8', BLACK, PAWN_B,   1, 7, 2);
// 
p['rw1'] = new Piece('rw1', WHITE, ROOK_W,   7,0, 8);
p['nw1'] = new Piece('nw1', WHITE, KNIGHT_W, 7,1,  1);
p['bw1'] = new Piece('bw1', WHITE, BISHOP_W, 7,2,  8);
p['qw']  = new Piece('qw',  WHITE, QUEEN_W,  7,3,  8);
p['kw']  = new Piece('kw',  WHITE, KING_W,   7,4,  1);
p['bw2'] = new Piece('bw2', WHITE, BISHOP_W, 7,5,  8);
p['nw2'] = new Piece('nw2', WHITE, KNIGHT_W, 7,6,  1);
p['rw2'] = new Piece('rw2', WHITE, PAWN_W,   7,7,  8);
p['pw1'] = new Piece('pw1', WHITE, PAWN_W,   6,0,  2);
p['pw2'] = new Piece('pw2', WHITE, PAWN_W,   6,1,  2);
p['pw3'] = new Piece('pw3', WHITE, PAWN_W,   6,2,  2);
p['pw4'] = new Piece('pw4', WHITE, PAWN_W,   6,3,  2);
p['pw5'] = new Piece('pw5', WHITE, PAWN_W,   6,4,  2);
p['pw6'] = new Piece('pw6', WHITE, PAWN_W,   6,5,  2);
p['pw7'] = new Piece('pw7', WHITE, PAWN_W,   6,6,  2);
p['pw8'] = new Piece('pw8', WHITE, PAWN_W,   6,7,  2);
return p
} 
let pieces = {} 
// Adding event listeners and placing the piece when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Creating a new Piece instance
    // const piece = new Piece(0, 0, ROOK_B);
    // const piece2 = new Piece(0, 1, KNIGHT_B);
    // piece.placeOnBoard();
    // piece2.placeOnBoard()
    pieces = getPieces()
    let keys = Object.keys(pieces) 
    for ( let i = 0 ; i < keys.length; i++ ) { 
        const k = keys[i]
        pieces[k].placeOnBoard()
    }
    // Adding click event listeners
    addClickListeners();
});
