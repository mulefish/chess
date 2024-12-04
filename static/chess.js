let activePiece = null;
let possibleMoves = [];

class Piece {
    constructor(key, color, icon, row, col, recurseDepth) {
        this.key = key;
        this.color = color;
        this.icon = icon;
        this.row = row;
        this.col = col;
        this.recurseDepth = recurseDepth;
        this.moves = getPossibleMoveArrays(icon);
    }

    placeOnBoard() {
        const cellId = `${this.row}-${this.col}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.add('unselectable'); // Make the icon unselectable
            cell.innerHTML = "<span class='chess-piece'>" + this.icon + "</span>";
            cell.piece = this;
        } else {
            console.log(`Cell with id ${cellId} not found`);
        }
    }
}

function setActivePiece(piece) {
    if (piece == null) {
        document.getElementById("activePiece").innerHTML = "";
    } else {
        document.getElementById("activePiece").innerHTML = piece.key + " " + piece.icon;
    }
}

function isValidMove(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function highlightCells(possibleMoves) {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('highlighted');
    });

    possibleMoves.forEach(move => {
        const [row, col] = move;
        const cellId = `${row}-${col}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.add('highlighted');
        }
    });
}

function getPossibleMoves(piece) {
    const startRow = piece.row;
    const startCol = piece.col;
    const possibleMoves = [];

    function recurse(row, col, direction, depth) {
        if (depth === 0) return;

        const [dr, dc] = direction;
        const newRow = row + dr;
        const newCol = col + dc;

        if (!isValidMove(newRow, newCol)) return;

        const targetCell = document.getElementById(`${newRow}-${newCol}`);
        if (targetCell.piece) {
            if (targetCell.piece.color === piece.color) {
                return; // Same color, stop recursion
            } else {
                possibleMoves.push([newRow, newCol]);
                return; // Different color, allow but stop recursion
            }
        } else {
            possibleMoves.push([newRow, newCol]);
        }

        recurse(newRow, newCol, direction, depth - 1);
    }

    for (const direction of piece.moves) {
        recurse(startRow, startCol, direction, piece.recurseDepth);
    }

    return possibleMoves;
}

function zeroOutActive() {
    setActivePiece(null);
    possibleMoves = [];
    highlightCells(possibleMoves);
}

// Function to add click event listeners to each cell
function addClickListeners() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (activePiece) {
                const cellId = cell.id;
                const moveExists = possibleMoves.some(move => move.join('-') === cellId);

                if (moveExists) {
                    console.log(`YAY  LAND HERE Clicked on cell: ${cell.id}`);

                    // If the cell has a piece, capture it and log details
                    if (cell.piece) {
                        console.log(`Captured piece: ${cell.piece.icon} (color: ${cell.piece.color}) at [${cell.id}]`);
                        cell.piece = null; // Remove the captured piece
                    }

                    // Move the active piece
                    const [newRow, newCol] = cellId.split('-').map(Number);
                    const oldCellId = `${activePiece.row}-${activePiece.col}`;
                    const oldCell = document.getElementById(oldCellId);
                    if (oldCell) {
                        oldCell.innerHTML = '';
                        oldCell.piece = null;
                    }

                    activePiece.row = newRow;
                    activePiece.col = newCol;
                    activePiece.placeOnBoard();
                    activePiece = null;

                    // Clear highlights after moving the piece
                    zeroOutActive();
                } else {
                    zeroOutActive();
                }
            } else if (cell.piece) {
                possibleMoves = getPossibleMoves(cell.piece);
                activePiece = cell.piece; // Set the active piece
                setActivePiece(cell.piece);
                highlightCells(possibleMoves);
                console.log(`YAY Clicked on cell: ${cell.id}, Piece: ${cell.piece.icon} key: ${cell.piece.key} and ` + JSON.stringify(possibleMoves));
            } else {
                console.log(`BOO Clicked on cell: ${cell.id}`);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    pieces = getPieces();
    let keys = Object.keys(pieces);
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        pieces[k].placeOnBoard();
    }
    // Adding click event listeners
    addClickListeners();
});
