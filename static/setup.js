let board = []
let pieces = {}
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
const BLACK = "BLACK";
const WHITE = "WHITE";
const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"]

function getHowToMove(icon) {
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


function init() {

    class Cell {
        constructor(row, col) {
            this.row = row
            this.col = col
            this.id = `${row}-${col}`
            this.pieceRef = undefined
        }
        setPiece(key) {
            this.pieceRef = key
        }
        getId() {
            if (this.pieceRef !== undefined) {
                return " " + this.pieceRef
            }
            return " ."
        }
    }

    for (let r = 0; r < 8; r++) {
        board[r] = []
        for (let c = 0; c < 8; c++) {
            const cell = new Cell(r, c)
            board[r][c] = cell
        }
    }

    class Piece {
        constructor(key, icon, color, row, col, depth) {
            this.key = key
            this.icon = icon
            this.color = color
            this.row = row
            this.col = col
            this.cellId = `${row}-${col}`
            this.depth = depth
            this.movedCount = -1
            this.placePiece()
            pieces[key] = this
            this.moves = undefined
            this.attacks = undefined
            this.setHowToMove()
        }
        setHowToMove() {
            this.moves = getHowToMove(this.icon)
            this.attacks = getHowToMove(this.icon)
        }

        setRowCol(row, col) {
            this.row = row
            this.col = col
            this.cellId = `${row}-${col}`
            this.placePiece()
        }
        special() {
            // This func is here to allow JS to mimick Java's @Override 
            // Why? Because pawns and kings are tricksy
        }
        placePiece() {
            this.movedCount++
            if (this.movedCount === 1) {
                this.special()
            }
            board[this.row][this.col].setPiece(this.key)
        }

        getPossibleMoves() {
            let possibleMoves = [];

            const isWithinBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

            this.moves.forEach(([dr, dc]) => {
                let r = this.row;
                let c = this.col;
                let step = 0;

                while (true) {
                    r += dr;
                    c += dc;
                    step++;

                    if (!isWithinBounds(r, c)) break; // Stop if out of bounds

                    const targetCell = board[r][c];

                    if (targetCell.pieceRef) {
                        const targetPiece = pieces[targetCell.pieceRef];
                        break; // Stop further movement in this direction!
                    }

                    possibleMoves.push([r, c]);

                    if (this.depth > 0 && step >= this.depth) break;
                }
            });

            return possibleMoves;
        }



        getPossibleAttacks() {
            let possibleAttacks = [];

            const isWithinBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

            this.moves.forEach(([dr, dc]) => {
                let r = this.row;
                let c = this.col;
                let step = 0;

                while (true) {
                    r += dr;
                    c += dc;
                    step++;

                    if (!isWithinBounds(r, c)) break;
                    const targetCell = board[r][c];
                    if (targetCell.pieceRef) {
                        const targetPiece = pieces[targetCell.pieceRef];
                        if (targetPiece && targetPiece.color !== this.color) {
                            possibleAttacks.push([r, c]); // Can capture enemy piece!
                        }
                        break;
                    }

                    if (this.depth > 0 && step >= this.depth) break;
                }
            });
            return possibleAttacks;
        }
    }
    class BlackPawn extends Piece {
        setHowToMove() {
            this.moves = getHowToMove(this.icon)
            this.attacks = [[1, -1], [1, 1]];
        }
    }
    class WhitePawn extends Piece {
        setHowToMove() {
            this.moves = getHowToMove(this.icon)
            this.attacks = [[-1, -1], [-1, 1]];
        }
    }
    class King extends Piece {
        setHowToMove() {
            this.moves = getHowToMove(this.icon)
        }
    }

    // The pieces will self register into the global 'pieces' collection
    new WhitePawn("wp1", PAWN_W, WHITE, 6, 0, 2)
    new WhitePawn("wp2", PAWN_W, WHITE, 6, 1, 2)
    new King("wk1", KING_W, WHITE, 7, 4, 1)
    new Piece("wr2", ROOK_W, WHITE, 7, 7, 8)

    new BlackPawn("bp1", PAWN_B, BLACK, 1, 0, 2)
    new WhitePawn("bp2", PAWN_B, BLACK, 1, 7, 2)
}

function showBoard(possible, attacks) {
    let matrix = []
    for (let row = 0; row < board.length; row++) {
        matrix[row] = []
        for (let col = 0; col < board[row].length; col++) {
            matrix[row][col] = board[row][col].getId() + " "
        }
    }

    possible.forEach((rowCol) => {
        const [r, c] = rowCol
        matrix[r][c] = "x"
    })

    attacks.forEach((rowCol) => {
        const [r, c] = rowCol
        matrix[r][c] = "A"
    })

    let x = "\n"
    matrix.forEach((row) => {
        row.forEach((col) => {
            x += col
        })
        x += "\n"
    })
    console.log(x)

}



module.exports = { board, pieces, showBoard, init };
