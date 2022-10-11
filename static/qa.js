const ROOK = "rook"
const KNIGHT = "knight"
const BISHOP = "bishop"
const QUEEN = "queen"
const KING = "king"
const PAWN = "pawn"
const WHITE = "white"
const BLACK = "black"
let pieces = {}
class Piece {
    constructor(color, kind, row, col, moves, attacks) {
        this.color = color;
        this.kind = kind;
        this.row = row;
        this.col = col;
        this.moves = moves
        // Movement special for pawns and knights
        if (kind === KNIGHT || kind === PAWN) {
            this.recurse = 1
        } else {
            this.recurse = 8
        }
        // Special for pawns: their attacks are different from their moves
        if (attacks === undefined) {
            this.attacks = moves
        } else {
            this.attacks = attacks
        }
    }
    getHtml() {
        return `<i class='fas fa-chess-${this.kind}' style='font-size:36px;color:${this.color}'></i>`
    }
}

function setup() {
    pieces["1_1"] = new Piece(BLACK, ROOK, 1, 1, [8, -8, -1, 1])
    pieces["2_1"] = new Piece(BLACK, KNIGHT, 2, 1, [6, -6, 15, 17, 10, -6, -15, -17])
    pieces["3_1"] = new Piece(BLACK, BISHOP, 3, 1, [9, -7, -9, 7])
    pieces["4_1"] = new Piece(BLACK, QUEEN, 4, 1, [-1, 7, 8, 9, 1, -7, -8, -9])
    pieces["5_1"] = new Piece(BLACK, KING, 5, 1, [-1, 7, 8, 9, 1, -7, -8, -9])
    pieces["6_1"] = new Piece(BLACK, BISHOP, 6, 1, [9, -7, -9, 7])
    pieces["7_1"] = new Piece(BLACK, KNIGHT, 7, 1, [6, -6, 15, 17, 10, -6, -15, -17])
    pieces["8_1"] = new Piece(BLACK, ROOK, 8, 1, [8, -8, -1, 1])
    pieces["1_2"] = new Piece(BLACK, PAWN, 1, 1, [-7, 9])
    pieces["2_2"] = new Piece(BLACK, PAWN, 2, 2, [1], [-7, 9])
    pieces["3_2"] = new Piece(BLACK, PAWN, 3, 2, [1], [-7, 9])
    pieces["4_2"] = new Piece(BLACK, PAWN, 4, 2, [1], [-7, 9])
    pieces["5_2"] = new Piece(BLACK, PAWN, 5, 2, [1], [-7, 9])
    pieces["6_2"] = new Piece(BLACK, PAWN, 6, 2, [1], [-7, 9])
    pieces["7_2"] = new Piece(BLACK, PAWN, 7, 2, [1], [-7, 9])
    pieces["8_2"] = new Piece(BLACK, PAWN, 8, 2, [1], [-7, 9])
    //
    pieces["1_7"] = new Piece(WHITE, PAWN, 1, 7, [-1], [-9, 7])
    pieces["2_7"] = new Piece(WHITE, PAWN, 2, 7, [-1], [-9, 7])
    pieces["3_7"] = new Piece(WHITE, PAWN, 3, 7, [-1], [-9, 7])
    pieces["4_7"] = new Piece(WHITE, PAWN, 4, 7, [-1], [-9, 7])
    pieces["5_7"] = new Piece(WHITE, PAWN, 5, 7, [-1], [-9, 7])
    pieces["6_7"] = new Piece(WHITE, PAWN, 6, 7, [-1], [-9, 7])
    pieces["7_7"] = new Piece(WHITE, PAWN, 7, 7, [-1], [-9, 7])
    pieces["8_7"] = new Piece(WHITE, PAWN, 8, 7, [-1], [-9, 7])
    pieces["1_8"] = new Piece(WHITE, ROOK, 1, 8, [8, -8, -1, 1])
    pieces["2_8"] = new Piece(WHITE, KNIGHT, 2, 8, [6, -6, 15, 17, 10, -6, -15, -17])
    pieces["3_8"] = new Piece(WHITE, BISHOP, 3, 8, [9, -7, -9, 7])
    pieces["4_8"] = new Piece(WHITE, QUEEN, 4, 8, [-1, 7, 8, 9, 1, -7, -8, -9])
    pieces["5_8"] = new Piece(WHITE, KING, 5, 8, [-1, 7, 8, 9, 1, -7, -8, -9])
    pieces["6_8"] = new Piece(WHITE, BISHOP, 6, 8, [9, -7, -9, 7])
    pieces["7_8"] = new Piece(WHITE, KNIGHT, 7, 8, [6, -6, 15, 17, 10, -6, -15, -17])
    pieces["8_8"] = new Piece(WHITE, ROOK, 8, 8, [8, -8, -1, 1])

    for (let k in pieces) {
        document.getElementById(k).innerHTML = pieces[k].getHtml()
    }
}
function setActive(cell) {
    debugger
    // console.log( cell.id )
    // try { 

    // document.getElementById('activeCell').innerHTML = "HELLO: " + cell.id
    // } catch( boom ) {
    //     console.log( boom )
    // }
}
