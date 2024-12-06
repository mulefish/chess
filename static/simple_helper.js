const PAWN_B = '<i class="fas fa-chess-pawn" style="color: white; font-size: 48px;"></i>' // "♟";
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
const PAWN_W =  `<i class="fas fa-chess-pawn" style="color: white; font-size: 48px;"></i>`// "♙";
const BLACK = "BLACK";
const WHITE = "WHITE";
const LETTERS = ["a", "b", "c","d","e", "f","g","h"]
let count = 0 
function yellow(msg) { 
    count++;
    console.log("%c " + count + "  " + msg, "background-color:yellow") 
}
function green(msg) { 
    count++;
    console.log("%c " + count + "  " + msg, "background-color:lightgreen") 
}
function getPossibleMoveArrays(icon) {
    switch (icon) {
        case KNIGHT_B:
            return [
                [-1, -2], [1, -2],
                [-2, -1], [2, -1],
                [-2, 1], [2, 1],
                [-1, 2], [1, 2],
            ];
        case ROOK_B:
            return [[0, -1], [0, 1], [-1, 0], [1, 0]];
        case BISHOP_B:
            return [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        case QUEEN_B:
            return [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]];
        case KING_B:
            return [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]];
        case PAWN_B:
            return [[1, 0]];
        case KNIGHT_W:
            return [
                [-1, -2], [1, -2],
                [-2, -1], [2, -1],
                [-2, 1], [2, 1],
                [-1, 2], [1, 2],
            ];
        case ROOK_W:
            return [[0, -1], [0, 1], [-1, 0], [1, 0]];
        case BISHOP_W:
            return [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        case QUEEN_W:
            return [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]];
        case KING_W:
            return [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]];
        case PAWN_W:
            return [[-1, 0]];

        default:
            return [];
    }
}



function getPieces() {
    let p = {}
    p['rb1'] = new Piece('rb1', BLACK, ROOK_B, 0, 0, 8);
    p['nb1'] = new Piece('nb1', BLACK, KNIGHT_B, 0, 1, 1);
    p['bb1'] = new Piece('bb1', BLACK, BISHOP_B, 0, 2, 8);
    p['qb'] = new Piece('qb', BLACK, QUEEN_B, 0, 3, 8);
    p['kb'] = new King('kb', BLACK, KING_B, 0, 4, 1);
    p['bb2'] = new Piece('bb2', BLACK, BISHOP_B, 0, 5, 8);
    p['nb2'] = new Piece('nb2', BLACK, KNIGHT_B, 0, 6, 1);
    p['rb2'] = new Pawn('rb2', BLACK, PAWN_B, 0, 7, 8);
    p['pb1'] = new Pawn('pb1', BLACK, PAWN_B, 1, 0, 2);
    p['pb2'] = new Pawn('pb2', BLACK, PAWN_B, 1, 1, 2);
    p['pb3'] = new Pawn('pb3', BLACK, PAWN_B, 1, 2, 2);
    p['pb4'] = new Pawn('pb4', BLACK, PAWN_B, 1, 3, 2);
    p['pb5'] = new Pawn('pb5', BLACK, PAWN_B, 1, 4, 2);
    p['pb6'] = new Pawn('pb6', BLACK, PAWN_B, 1, 5, 2);
    p['pb7'] = new Pawn('pb7', BLACK, PAWN_B, 1, 6, 2);
    p['pb8'] = new Pawn('pb8', BLACK, PAWN_B, 1, 7, 2);
    // 
    p['rw1'] = new Piece('rw1', WHITE, ROOK_W, 7, 0, 8);
    p['nw1'] = new Piece('nw1', WHITE, KNIGHT_W, 7, 1, 1);
    p['bw1'] = new Piece('bw1', WHITE, BISHOP_W, 7, 2, 8);
    p['qw'] = new Piece('qw', WHITE, QUEEN_W, 7, 3, 8);
    p['kw'] = new King('kw', WHITE, KING_W, 7, 4, 1);
    p['bw2'] = new Piece('bw2', WHITE, BISHOP_W, 7, 5, 8);
    p['nw2'] = new Piece('nw2', WHITE, KNIGHT_W, 7, 6, 1);    
    p['rw2'] = new Piece('rw2', WHITE, ROOK_W, 7, 7, 8);
    p['pw1'] = new Pawn('pw1', WHITE, PAWN_W, 6, 0, 2);
    p['pw2'] = new Pawn('pw2', WHITE, PAWN_W, 6, 1, 2);
    p['pw3'] = new Pawn('pw3', WHITE, PAWN_W, 6, 2, 2);
    p['pw4'] = new Pawn('pw4', WHITE, PAWN_W, 6, 3, 2);
    p['pw5'] = new Pawn('pw5', WHITE, PAWN_W, 6, 4, 2);
    p['pw6'] = new Pawn('pw6', WHITE, PAWN_W, 6, 5, 2);
    p['pw7'] = new Pawn('pw7', WHITE, PAWN_W, 6, 6, 2);
    p['pw8'] = new Pawn('pw8', WHITE, PAWN_W, 6, 7, 2);
    return p
}

class Piece {
    constructor(key, color, icon, row, col, recurseDepth) {
        this.key = key;
        this.color = color;
        this.icon = icon;
        this.row = row;
        this.col = col;
        this.recurseDepth = recurseDepth;
        this.moves = getPossibleMoveArrays(icon);
        this.attacks = this.moves; 
        this.isPawn = false;
        this.isKing = false; 
        if ( this.icon === PAWN_B) {
            this.attacks = [[1, -1], [1, -1]];
            this.isPawn = true 
        } else if ( this.icon === PAWN_W ) {
            this.attacks = [[-1, -1], [-1, -1]];
            this.isPawn = true 
        }
        this.moveCount = -1;
        this.lastMove = undefined 
    }
    specialLogic() {
        // This func is here to be overridden: 
        // This func is here to provide the equivlent of Java's @Override
    }
    placeOnBoard() {}
    // placeOnBoard() {
    //     const cellId = `${this.row}-${this.col}`;
    //     const cell = document.getElementById(cellId);
    //     if (cell) {
    //         this.moveCount++;
    //         if ( this.moveCount > 0 ) {
    //             // this.lastMove = (8 - (-1 + ( 8 - this.row ))) + LETTERS[this.col]
    //             this.lastMove = (1 + this.row) + LETTERS[this.col]
    //             console.log("row " + this.row + " col " + this.col + "  key " + this.key + " icon " + this.icon + " move " + this.lastMove ) 
    //             if ( this.icon === PAWN_B || this.icon === PAWN_W ) {
    //                 this.specialLogic()
    //             }
    //         }
    //         cell.classList.add('unselectable'); // Make the icon unselectable
    //         const pieceElement = document.createElement('span');
    //         pieceElement.className = 'chess-piece';
    //         pieceElement.innerHTML = this.icon;
    //         cell.appendChild(pieceElement);
    //         cell.piece = this;
    //     } else {
    //         console.log(`Cell with id ${cellId} not found`);
    //     }
    // }
}

class Pawn extends Piece {
    specialLogic() {
        this.recurseDepth = 1; 
    }
}

class King extends Piece {
    specialLogic() {
    }
}


let pieces = getPieces() 