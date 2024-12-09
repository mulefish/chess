const boardState = Array(8).fill(null).map(() => Array(8).fill(null));
const pieces = getPieces();

pieces.forEach(piece => {
    boardState[piece.row][piece.col] = piece;
});

const board = document.getElementById('chess-board');

for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const cell = document.createElement('div');
        cell.className = `cell ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
        cell.id = `${row}-${col}`;
        board.appendChild(cell);
    }
}

let selectedPiece = null;

function highlightMoves(moves) {
    moves.forEach(([row, col]) => {
        const cell = document.getElementById(`${row}-${col}`);
        if (cell) {
            cell.classList.add('highlight');
            cell.addEventListener('click', movePiece);
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(cell => {
        cell.classList.remove('highlight');
        cell.removeEventListener('click', movePiece);
    });
}

function movePiece(event) {
    if (!selectedPiece) return;

    const targetCell = event.target;
    const [targetRow, targetCol] = targetCell.id.split('-').map(Number);

    const oldCell = document.getElementById(`${selectedPiece.row}-${selectedPiece.col}`);
    oldCell.innerHTML = ''; // Clear the piece from the old cell

    boardState[selectedPiece.row][selectedPiece.col] = null; // Clear the state of the old cell
    selectedPiece.row = targetRow;
    selectedPiece.col = targetCol;
    boardState[targetRow][targetCol] = selectedPiece; // Update the state of the new cell

    targetCell.innerHTML = selectedPiece.icon; // Place the piece in the new cell

    clearHighlights();
    selectedPiece = null;

    // Reinitialize the event listeners for all pieces
    pieces.forEach(piece => {
        const cell = document.getElementById(`${piece.row}-${piece.col}`);
        cell.innerHTML = piece.icon;
        cell.removeEventListener('click', pieceClickListener); // Remove the old listener
        cell.addEventListener('click', pieceClickListener); // Add the new listener
    });
}

function pieceClickListener(event) {
    const cell = event.currentTarget;
    const [row, col] = cell.id.split('-').map(Number);
    const piece = boardState[row][col];

    // Add this null check to prevent errors
    if (!piece) return;

    if (selectedPiece === piece) {
        clearHighlights();
        selectedPiece = null;
    } else {
        clearHighlights();
        selectedPiece = piece;
        highlightMoves(piece.getPossibleMoves(boardState));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    pieces.forEach(piece => {
        const cell = document.getElementById(`${piece.row}-${piece.col}`);
        cell.innerHTML = piece.icon;
        cell.addEventListener('click', pieceClickListener);
        boardState[piece.row][piece.col] = piece; // Update board state
    });
});
