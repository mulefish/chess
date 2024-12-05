let activePiece = null;
let possibleMoves = [];

function movePieceToCell(piece, cell) {
    if (cell.piece) {
        // Log details of the captured piece
        console.log(`Captured piece: ${cell.piece.key}, ${cell.piece.icon} (color: ${cell.piece.color}) at [${cell.id}]`);
        
        // Remove the captured piece element from the DOM
        const capturedPieceElement = cell.querySelector('.chess-piece');
        if (capturedPieceElement) {
            console.log(capturedPieceElement);
            cell.removeChild(capturedPieceElement);
        }
        const icon = pieces[cell.piece.key].icon
        if ( pieces[cell.piece.key].color === BLACK ) { 
            document.getElementById("killedBlack").innerHTML += " " + icon 
        } else {
            document.getElementById("killedWhite").innerHTML += " " + icon 

        }
        // Delete the captured piece from the pieces dictionary
        delete pieces[cell.piece.key];
        
        // Confirm deletion by logging current pieces keys
        let keys = Object.keys(pieces);
        console.log(`Remaining pieces: ${keys.length}`, keys);

        cell.piece = null; // Remove the captured piece reference
    }

    const [newRow, newCol] = cell.id.split('-').map(Number);
    const oldCellId = `${piece.row}-${piece.col}`;
    const oldCell = document.getElementById(oldCellId);
    if (oldCell) {
        const pieceElement = oldCell.querySelector('.chess-piece');
        if (pieceElement) {
            oldCell.removeChild(pieceElement);
        }
        oldCell.piece = null;
    }

    piece.row = newRow;
    piece.col = newCol;
    piece.placeOnBoard();
}

function addClickListeners() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (activePiece) {
                const cellId = cell.id;
                const moveExists = possibleMoves.some(move => move.join('-') === cellId);

                if (moveExists) {
                    console.log(`YAY  LAND HERE Clicked on cell: ${cell.id}`);
                    movePieceToCell(activePiece, cell);
                    activePiece = null;
                    zeroOutActive();
                } else {
                    console.log(`Invalid move. Clearing active piece and possible moves.`);
                    zeroOutActive();
                }
            } else if (cell.piece) {
                possibleMoves = getPossibleMoves(cell.piece);
                activePiece = cell.piece;
                setActivePiece(cell.piece);
                highlightCells(possibleMoves);
                console.log(`YAY Clicked on cell: ${cell.id}, Piece: ${cell.piece.icon} key: ${cell.piece.key} and ` + JSON.stringify(possibleMoves));
            } else {
                console.log(`BOO Clicked on cell: ${cell.id}`);
                zeroOutActive();
            }
        });
    });
}

function setActivePiece(piece) {
    const activePieceElement = document.getElementById("activePiece");
    if (piece == null) {
        activePieceElement.innerHTML = "";
    } else {
        activePieceElement.innerHTML = piece.key + " " + piece.icon;
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
                return; 
            } else {
                possibleMoves.push([newRow, newCol]);
                return; 
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
    activePiece = null;
    possibleMoves = [];
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('highlighted');
    });
    setActivePiece(null);
}

document.addEventListener('DOMContentLoaded', () => {
    pieces = getPieces();
    let keys = Object.keys(pieces);
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        pieces[k].placeOnBoard();
    }
    addClickListeners();
});
