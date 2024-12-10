const boardState = Array(8).fill(null).map(() => Array(8).fill(null));
const pieces = getPieces();
let possibleAttacks = [] 

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

    // Check if the target cell is in the list of possible attacks
    const isAttack = possibleAttacks.some(([row, col]) => row === targetRow && col === targetCol);

    if (isAttack) {
        // If it's an attack, ensure the target piece is correctly identified and removed
        const targetPiece = boardState[targetRow][targetCol];
        if (targetPiece) {
            console.log(`Attacking piece: ${selectedPiece.icon} at ${selectedPiece.row}-${selectedPiece.col}`);
            console.log(`Removing attacked piece: ${targetPiece.icon} at ${targetRow}-${targetCol}`);
            targetCell.innerHTML = ''; // Clear the attacked piece visually
            boardState[targetRow][targetCol] = null; // Remove the attacked piece from the board state
        }
    } else {
        console.log(`No attack: Moving to ${targetRow}-${targetCol}`);
    }

    // Clear the old position of the selected piece
    const oldCell = document.getElementById(`${selectedPiece.row}-${selectedPiece.col}`);
    oldCell.innerHTML = ''; // Clear the old cell visually
    boardState[selectedPiece.row][selectedPiece.col] = null; // Clear the state of the old cell

    // Move the selected piece to the new position
    selectedPiece.row = targetRow;
    selectedPiece.col = targetCol;
    boardState[targetRow][targetCol] = selectedPiece; // Update the state of the new cell
    targetCell.innerHTML = selectedPiece.icon; // Update the target cell visually

    // Clear highlights and reset selection
    clearHighlights();
    selectedPiece = null;

    // Reinitialize the event listeners for all pieces
    reinitializeEventListeners();

    // Update piece info (for debugging or UI updates)
    updatePieceInfo(selectedPiece, 'selected');
}


function reinitializeEventListeners() {
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

    if (!piece) return;

    if (cell.classList.contains('attack')) {
        const targetPiece = boardState[row][col];

        // console.log(`Attackee: ${targetPiece.icon}`);
        // console.log(`Attacker: ${selectedPiece.icon}`);


        console.log(`Attackee!: ${targetPiece.row}-${targetPiece.col}`);
        console.log(`Attacker!: ${selectedPiece.row}-${targetPiece.col}`);


        // Remove the attacked piece
        cell.innerHTML = '129';
//        // boardState[row][col] = null;

        // // Move the attacking piece
        const oldCell = document.getElementById(`${selectedPiece.row}-${selectedPiece.col}`);
        oldCell.innerHTML = '';
        boardState[selectedPiece.row][selectedPiece.col] = null;

        selectedPiece.row = row;
        selectedPiece.col = col;
        boardState[row][col] = selectedPiece;
        cell.innerHTML = selectedPiece.icon;

        clearHighlights();
        selectedPiece = null;

        reinitializeEventListeners();
        updatePieceInfo(selectedPiece, 'selected');
        return;
    }

    if (selectedPiece === piece) {
        clearHighlights();
        selectedPiece = null;
    } else {
        clearHighlights();
        selectedPiece = piece;
        highlightMoves(piece.getPossibleMoves(boardState));
        possibleAttacks = piece.getPossibleAttacks(boardState )
        highlightAttacks(possibleAttacks);
        console.log( "possibleAttacks=" + JSON.stringify( possibleAttacks) ) 
    }

    updatePieceInfo(selectedPiece, 'selected');
}

document.addEventListener('DOMContentLoaded', () => {
    pieces.forEach(piece => {
        const cell = document.getElementById(`${piece.row}-${piece.col}`);
        cell.innerHTML = piece.icon;
        cell.addEventListener('click', pieceClickListener);
        boardState[piece.row][piece.col] = piece; // Update board state
    });
});
