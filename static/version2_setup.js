
const PAWN_B = '<i class="fas fa-chess-pawn" style="color: black; font-size: 48px;"></i>';
const ROOK_B = '<i class="fas fa-chess-rook" style="color: black; font-size: 48px;"></i>';
const KNIGHT_B = '<i class="fas fa-chess-knight" style="color: black; font-size: 48px;"></i>';
const BISHOP_B = '<i class="fas fa-chess-bishop" style="color: black; font-size: 48px;"></i>';
const QUEEN_B = '<i class="fas fa-chess-queen" style="color: black; font-size: 48px;"></i>';
const KING_B = '<i class="fas fa-chess-king" style="color: black; font-size: 48px;"></i>';
const ROOK_W = '<i class="fas fa-chess-rook" style="color: tan; font-size: 48px;"></i>';
const KNIGHT_W = '<i class="fas fa-chess-knight" style="color: tan; font-size: 48px;"></i>';
const BISHOP_W = '<i class="fas fa-chess-bishop" style="color: tan; font-size: 48px;"></i>';
const QUEEN_W = '<i class="fas fa-chess-queen" style="color: tan; font-size: 48px;"></i>';
const KING_W = '<i class="fas fa-chess-king" style="color: tan; font-size: 48px;"></i>';
const PAWN_W = '<i class="fas fa-chess-pawn" style="color: tan; font-size: 48px;"></i>';

class Piece {
    constructor(icon, row, col, type, color) {
        this.icon = icon;
        this.row = row;
        this.col = col;
        this.type = type;
        this.color = color;
    }

    getPossibleMoves(board) {
        let moves = [];
        switch (this.type) {
            case 'pawn':
                const direction = this.color === 'white' ? -1 : 1;
                const forwardRow = this.row + direction;
                if (board[forwardRow] && !board[forwardRow][this.col]) {
                    moves.push([forwardRow, this.col]);
                }
                break;
            case 'rook':
                moves = this.getLinearMoves(board, [[1, 0], [0, 1], [-1, 0], [0, -1]]);
                break;
            case 'knight':
                moves = this.getKnightMoves(board);
                break;
            case 'bishop':
                moves = this.getLinearMoves(board, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
                break;
            case 'queen':
                moves = this.getLinearMoves(board, [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
                break;
            case 'king':
                moves = this.getLinearMoves(board, [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], 1);
                break;
        }
        return moves;
    }

    getLinearMoves(board, directions, maxSteps = 8) {
        const moves = [];
        for (const [dr, dc] of directions) {
            for (let step = 1; step <= maxSteps; step++) {
                const newRow = this.row + dr * step;
                const newCol = this.col + dc * step;
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
                if (board[newRow][newCol]) {
                    // if (board[newRow][newCol].color !== this.color) {
                    //     moves.push([newRow, newCol]);
                    // }
                    break;
                }
                moves.push([newRow, newCol]);
            }
        }
        return moves;
    }

    getKnightMoves(board) {
        const moves = [];
        const deltas = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        for (const [dr, dc] of deltas) {
            const newRow = this.row + dr;
            const newCol = this.col + dc;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (!board[newRow][newCol]) {  // Only add the move if the cell is empty
                    moves.push([newRow, newCol]);
                }
            }
        }
        return moves;
    }
}

function getPieces() { 
    const p = [
        new Piece(ROOK_B, 0, 0, 'rook', 'black'),
        new Piece(KNIGHT_B, 0, 1, 'knight', 'black'),
        new Piece(BISHOP_B, 0, 2, 'bishop', 'black'),
        new Piece(QUEEN_B, 0, 3, 'queen', 'black'),
        new Piece(KING_B, 0, 4, 'king', 'black'),
        new Piece(BISHOP_B, 0, 5, 'bishop', 'black'),
        new Piece(KNIGHT_B, 0, 6, 'knight', 'black'),
        new Piece(ROOK_B, 0, 7, 'rook', 'black'),
        new Piece(PAWN_B, 1, 0, 'pawn', 'black'),
        new Piece(PAWN_B, 1, 1, 'pawn', 'black'),
        new Piece(PAWN_B, 1, 2, 'pawn', 'black'),
        new Piece(PAWN_B, 1, 3, 'pawn', 'black'),
        // ...Array.from({ length: 8 }, (_, i) => new Piece(PAWN_B, 1, i, 'pawn', 'black')),
        new Piece(ROOK_W, 7, 0, 'rook', 'white'),
        new Piece(KNIGHT_W, 7, 1, 'knight', 'white'),
        new Piece(BISHOP_W, 7, 2, 'bishop', 'white'),
        new Piece(QUEEN_W, 7, 3, 'queen', 'white'),
        new Piece(KING_W, 7, 4, 'king', 'white'),
        new Piece(BISHOP_W, 7, 5, 'bishop', 'white'),
        new Piece(KNIGHT_W, 7, 6, 'knight', 'white'),
        new Piece(ROOK_W, 7, 7, 'rook', 'white'),
        ...Array.from({ length: 8 }, (_, i) => new Piece(PAWN_W, 6, i, 'pawn', 'white')),
    ];
    return p
}


