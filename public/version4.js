// Chess Game Logic

// Constants
const black = "black"
const white = "white"
const PieceTypes = {
    PAWN: "pawn",
    ROOK: "rook",
    KNIGHT: "knight",
    BISHOP: "bishop",
    QUEEN: "queen",
    KING: "king",
};

const Colors = {
    WHITE: "white",
    BLACK: "black",
};

// Board and Game State
class Board {
    constructor() {
        this.pieces = {};
        this.activeCell = undefined;
        this.activePiece = undefined;
        this.highlighted = [];
        this.highlightedAttacks = [];
        this.lastMove = null;
    }

    resetHighlights() {
        removeHighlightFromCells(this.highlighted);
        removeHighlightFromCells(this.highlightedAttacks, "highlightAttack");
        this.highlighted = [];
        this.highlightedAttacks = [];
    }

    handleCellClick(event) {
        if (event.target.tagName !== 'TD' || !event.target.classList.contains('cell')) return;

        const row = parseInt(event.target.getAttribute('data-row'));
        const col = parseInt(event.target.getAttribute('data-col'));
        this.activeCell = event.target.getAttribute('id');

        if (this.highlightedAttacks.includes(this.activeCell)) {
            this.handleAttack(row, col);
        } else if (this.highlighted.includes(this.activeCell)) {
            this.handleMove(row, col);
        } else {
            this.selectPiece(event.target);
        }
    }

    handleMove(row, col) {
        const piece = this.pieces[this.activePiece];
        piece.moveTo(row, col);
        this.resetHighlights();
        this.activePiece = undefined;
    }

    handleAttack(row, col) {
        const piece = this.pieces[this.activePiece];
        const targetCell = `${row}-${col}`;
        const attackedPieceKey = document.getElementById(targetCell).getAttribute('data-piece');

        if (attackedPieceKey) {
            delete this.pieces[attackedPieceKey];
        }

        piece.moveTo(row, col);
        this.resetHighlights();
        this.activePiece = undefined;
    }

    selectPiece(cell) {
        this.activePiece = cell.getAttribute('data-piece');
        if (this.activePiece) {
            const piece = this.pieces[this.activePiece];
            this.resetHighlights();
            const possibleMoves = piece.getReachableCells();
            const possibleAttacks = piece.getAttackableCells();
            highlightCells(possibleMoves);
            highlightCells(possibleAttacks, "highlightAttack");
            this.highlighted = possibleMoves;
            this.highlightedAttacks = possibleAttacks;
        }
    }
}

const board = new Board();

// Piece Class
class Piece {
    constructor(id, row, col, icon, color, type, recurse) {
        this.id = id;
        this.row = row;
        this.col = col;
        this.icon = icon;
        this.color = color;
        this.type = type;
        this.recurse = recurse;
        this.cellId = `${row}-${col}`;
        this.moveCount = 0;
        board.pieces[id] = this;
        this.placePiece(this.cellId);
    }

    placePiece(cellId) {
        this.cellId = cellId;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.innerHTML = this.icon;
            cell.setAttribute('data-piece', this.id);
        }
    }

    removeFromCell() {
        const cell = document.getElementById(this.cellId);
        if (cell) {
            cell.innerHTML = "";
            cell.removeAttribute('data-piece');
        }
    }

    moveTo(row, col) {
        this.removeFromCell();
        this.row = row;
        this.col = col;
        this.cellId = `${row}-${col}`;
        this.placePiece(this.cellId);
        board.lastMove = { piece: this, from: this.cellId, to: `${row}-${col}` };
        this.moveCount++;
    }

    getReachableCells() {
        // Logic for piece-specific movement
        return calculateMoves(this.row, this.col, getPossibleMoves(this.type), this.recurse);
    }

    getAttackableCells() {
        // Logic for piece-specific attacks
        return calculateAttacks(this.row, this.col, getPossibleMoves(this.type), this.recurse, this.color);
    }
}

// Utility Functions
function getPossibleMoves(type) {
    switch (type) {
        case PieceTypes.ROOK:
            return [[-1, 0], [1, 0], [0, -1], [0, 1]];
        case PieceTypes.KNIGHT:
            return [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
        case PieceTypes.BISHOP:
            return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        case PieceTypes.QUEEN:
            return [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        case PieceTypes.KING:
            return [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        case PieceTypes.PAWN:
            return [[1, 0]]; // Adjust for color and en passant
        default:
            return [];
    }
}

function calculateMoves(row, col, moves, recurse) {
    const accumulator = [];

    function checkit(r1, c1, r2, c2, limit) {
        if (limit < 1) return;
        const newRow = r1 + r2;
        const newCol = c1 + c2;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const id = `${newRow}-${newCol}`;
            const cell = document.getElementById(id);
            if (cell && !cell.getAttribute('data-piece')) {
                accumulator.push(id);
                checkit(newRow, newCol, r2, c2, limit - 1);
            }
        }
    }

    moves.forEach(([r2, c2]) => {
        checkit(row, col, r2, c2, recurse);
    });

    return accumulator;
}

function calculateAttacks(row, col, moves, recurse, color) {
    // Similar to calculateMoves but includes attack logic
    return calculateMoves(row, col, moves, recurse); // Add attack-specific rules
}

function highlightCells(cellIds, highlightClass = "highlight") {
    cellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) cell.classList.add(highlightClass);
    });
}

function removeHighlightFromCells(cellIds, highlightClass = "highlight") {
    cellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) cell.classList.remove(highlightClass);
    });
}

// Event Listener
const table = document.querySelector('table');
if (table) {
    table.addEventListener('click', event => board.handleCellClick(event));
}

// Initialize Pieces
function initializePieces() {

    new Piece("br1", 0, 0, "♜", black, "rook", 8);
    new Piece("bn1", 0, 1, "♞", black, "knight", 1);
    new Piece("bb1", 0, 2, "♝", black, "bishop", 8);
    new Piece("bq", 0, 3, "♛", black, "queen", 8);
    new Piece("bk", 0, 4, "♚", black, "king", 1);
    new Piece("bb2", 0, 5, "♝", black, "bishop", 8);
    new Piece("bn2", 0, 6, "♞", black, "knight", 1);
    new Piece("br2", 0, 7, "♜", black, "rook", 8);
    new Piece("bpawn1", 5, 5, "♟", black, "pawnb", 2);
    new Piece("bpawn2", 5, 6, "♟", black, "pawnb", 2);
    new Piece("bpawn3", 5, 7, "♟", black, "pawnb", 2);
    new Piece("bpawn4", 5, 4, "♟", black, "pawnb", 2);
    new Piece("bpawn5", 5, 3, "♟", black, "pawnb", 2);
    new Piece("bpawn6", 1, 2, "♟", black, "pawnb", 2);
    new Piece("bpawn7", 1, 1, "♟", black, "pawnb", 2);


    new Piece("wr1", 7, 0, "♖", white, "rook", 8);
    new Piece("wn1", 7, 1, "♘", white, "knight", 1);
    new Piece("wb1", 7, 2, "♗", white, "bishop", 8);
    new Piece("wqueen", 7, 3, "Q", white, "queen", 8); // ♕
    new Piece("wk", 7, 4, "♔", white, "king", 1);
    new Piece("wb2", 7, 5, "♗", white, "bishop", 8);
    new Piece("wn2", 7, 6, "♘", white, "knight", 1);
    new Piece("wr2", 7, 7, "♖", white, "rook", 8);
    new Piece("wpawn1", 6, 0, "♙", white, "pawnw", 2);
    new Piece("wpawn2", 6, 1, "♙", white, "pawnw", 2);
    new Piece("wpawn3", 6, 2, "♙", white, "pawnw", 2);
    new Piece("wpawn4", 6, 3, "♙", white, "pawnw", 2);
    new Piece("wpawn5", 6, 4, "♙", white, "pawnw", 2);
    new Piece("wpawn6", 6, 5, "♙", white, "pawnw", 2);
    new Piece("wpawn7", 6, 6, "♙", white, "pawnw", 2);
    new Piece("wpawn7", 6, 7, "♙", white, "pawnw", 2);}

initializePieces();
