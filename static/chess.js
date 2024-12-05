let activePiece = null;
let possibleMoves = [];
let currentTurn = "WHITE";

function movePieceToCell(piece, cell) {
    if (cell.piece) {        
        const capturedPieceElement = cell.querySelector('.chess-piece');
        if (capturedPieceElement) {
            cell.removeChild(capturedPieceElement);
        }
        const icon = pieces[cell.piece.key].icon;
        if (pieces[cell.piece.key].color === BLACK) { 
            document.getElementById("killedBlack").innerHTML += " " + icon; 
        } else {
            document.getElementById("killedWhite").innerHTML += " " + icon;
        }
        delete pieces[cell.piece.key];
        let keys = Object.keys(pieces);
        cell.piece = null;
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

    // Change the turn after the piece is moved
    currentTurn = currentTurn === WHITE ? BLACK: WHITE;
    document.getElementById("whoseTurn").innerHTML = currentTurn;
}

function addClickListeners() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            console.log("%c CLICK!! " + new Date().getMilliseconds(), "background-color:yellow") 
            if (activePiece) {
                const cellId = cell.id;
                const moveExists = possibleMoves.some(move => move.join('-') === cellId);

                if (moveExists) {
                    movePieceToCell(activePiece, cell);
                    activePiece = null;
                    zeroOutActive();
                } else {
                    zeroOutActive();
                }
            } else if (cell.piece) {
                if (cell.piece.color === currentTurn) {
                    possibleMoves = getPossibleMoves(cell.piece);
                    activePiece = cell.piece;
                    setActivePiece(cell.piece);
                    highlightCells(possibleMoves);
                } else {
                }
            } else {
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

// function getPossibleMoves(piece) {
//     const startRow = piece.row;
//     const startCol = piece.col;
//     const possibleMoves = [];

//     function recurse(row, col, direction, depth, isPawn) {
//         if (depth === 0) return;

//         const [dr, dc] = direction;
//         const newRow = row + dr;
//         const newCol = col + dc;

//         if (!isValidMove(newRow, newCol)) return;

//         const targetCell = document.getElementById(`${newRow}-${newCol}`);
//         if (targetCell.piece) {
//             if (targetCell.piece.color === piece.color) {
//                 return; 
//             } else {
//                 possibleMoves.push([newRow, newCol]);
//                 return; 
//             }
//         } else {
//             possibleMoves.push([newRow, newCol]);
//         }

//         recurse(newRow, newCol, direction, depth - 1, isPawn);
//     }

//     for (const direction of piece.moves) {
//         recurse(startRow, startCol, direction, piece.recurseDepth, piece.isPawn);
//     }

//     return possibleMoves;
// }

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

        if (piece.isPawn) {
            if (dc === 0) {  // Forward moves
                if (!targetCell.piece) {
                    possibleMoves.push([newRow, newCol]);
                    // Check for the initial two-cell jump
                    if (piece.moveCount === 0 && depth === 2) {
                        const twoCellJump = document.getElementById(`${newRow + dr}-${newCol}`);
                        if (twoCellJump && !twoCellJump.piece) {
                            possibleMoves.push([newRow + dr, newCol]);
                        }
                    }
                }
            } else {  // Diagonal attacks
                if (targetCell.piece && targetCell.piece.color !== piece.color) {
                    possibleMoves.push([newRow, newCol]);
                }
            }
            return; // No need to recurse for pawns
        } else {
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
    }

    for (const direction of piece.moves) {
        recurse(startRow, startCol, direction, piece.recurseDepth);
    }

    // Add possible attacks for pawns separately
    if (piece.isPawn) {
        for (const attack of piece.attacks) {
            const [dr, dc] = attack;
            const attackRow = startRow + dr;
            const attackCol = startCol + dc;
            if (isValidMove(attackRow, attackCol)) {
                const attackCell = document.getElementById(`${attackRow}-${attackCol}`);
                if (attackCell.piece && attackCell.piece.color !== piece.color) {
                    possibleMoves.push([attackRow, attackCol]);
                }
            }
        }
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
    document.getElementById("whoseTurn").innerHTML = currentTurn; // Initialize turn display
});
