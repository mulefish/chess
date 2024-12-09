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

function updatePieceInfo(piece, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        if (piece) {
            element.innerHTML = `${piece.color} ${piece.type} at ${piece.row}-${piece.col}`;
        } else {
            element.innerHTML = 'None';
        }
    } else {
        console.log(`Element with ID ${elementId} not found.`);
    }
}

function highlightMoves(moves) {
    moves.forEach(([row, col]) => {
        const cell = document.getElementById(`${row}-${col}`);
        if (cell) {
            cell.classList.add('highlight');
            cell.addEventListener('click', movePiece);
        }
    });
}

function highlightAttacks(attacks) {
    attacks.forEach(([row, col]) => {
        const cell = document.getElementById(`${row}-${col}`);
        if (cell) {
            cell.classList.add('attack');
            cell.addEventListener('click', movePiece);
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(cell => {
        cell.classList.remove('highlight');
        cell.removeEventListener('click', movePiece);
    });
    document.querySelectorAll('.attack').forEach(cell => {
        cell.classList.remove('attack');
        cell.removeEventListener('click', movePiece);
    });
}

function movePiece(event) {
    if (!selectedPiece) return;

    event.stopPropagation(); // Stop the click event from propagating

    const targetCell = event.target.closest('.cell');
    const [targetRow, targetCol] = targetCell.id.split('-').map(Number);

    // Check if there's a piece on the target cell
    const targetPiece = boardState[targetRow][targetCol];
    if (targetPiece && targetPiece.color !== selectedPiece.color) {
        console.log(`Piece removed: ${targetPiece.icon}`);
        targetCell.innerHTML = ''; // Clear the target cell
        boardState[targetRow][targetCol] = null; // Remove the piece from the board state
    }

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

    updatePieceInfo(selectedPiece, 'selected'); // Update selected piece info
}

function pieceClickListener(event) {
    const cell = event.currentTarget;
    const [row, col] = cell.id.split('-').map(Number);
    const piece = boardState[row][col];

    // Add this null check to prevent errors
    if (!piece) return;

    if (selectedPiece) {
        // Check if the selected piece is under attack and being landed on
        if (piece.row === selectedPiece.row && piece.col === selectedPiece.col) {
            const oldCell = document.getElementById(`${selectedPiece.row}-${selectedPiece.col}`);
            oldCell.innerHTML = ''; // Clear the piece from the old cell

            boardState[selectedPiece.row][selectedPiece.col] = null; // Clear the state of the old cell
            selectedPiece = null;
            clearHighlights();
            updatePieceInfo(selectedPiece, 'selected'); // Update selected piece info
            return;
        }
    }

    if (selectedPiece === piece) {
        clearHighlights();
        selectedPiece = null;
    } else {
        clearHighlights();
        selectedPiece = piece;
        highlightMoves(piece.getPossibleMoves(boardState));
        highlightAttacks(piece.getPossibleAttacks(boardState)); // Highlight attackable cells
    }

    updatePieceInfo(selectedPiece, 'selected'); // Update selected piece info
}

document.addEventListener('DOMContentLoaded', () => {
    pieces.forEach(piece => {
        const cell = document.getElementById(`${piece.row}-${piece.col}`);
        cell.innerHTML = piece.icon;
        cell.addEventListener('click', pieceClickListener);
        boardState[piece.row][piece.col] = piece; // Update board state
    });
});
