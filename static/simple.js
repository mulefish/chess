document.addEventListener('DOMContentLoaded', () => {
    let pieces = getPieces();
    Object.keys(pieces).forEach(key => {
        const piece = pieces[key];
        const cellId = `${piece.row}-${piece.col}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            const pieceElement = document.createElement('span');
            pieceElement.className = 'chess-piece';
            pieceElement.innerHTML =  '<i class="fas fa-chess-pawn" style="color: white; font-size: 48px;"></i>` // piece.icon;
            pieceElement.style.zIndex = 10; // Set z-index for dragging
            pieceElement.style.position = 'absolute';
            pieceElement.style.top = '0';
            pieceElement.style.left = '0';
            pieceElement.addEventListener('mousedown', onMouseDown);
            cell.appendChild(pieceElement);
            cell.piece = piece;
            updatePiecePosition(pieceElement, cell); // Initialize piece position
        } else {
            console.log(`Cell with id ${cellId} not found`);
        }
    });
});

let draggedPiece = null;
let offsetX = 0;
let offsetY = 0;

function onMouseDown(event) {
    draggedPiece = event.target;
    const rect = draggedPiece.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(event) {
    if (draggedPiece) {
        draggedPiece.style.left = `${event.clientX - offsetX}px`;
        draggedPiece.style.top = `${event.clientY - offsetY}px`;
    }
}

function onMouseUp(event) {
    if (draggedPiece) {
        const cellSize = 50; // Assuming each cell is 50x50 pixels, adjust as needed
        const newRow = Math.floor((event.clientY - offsetY) / cellSize);
        const newCol = Math.floor((event.clientX - offsetX) / cellSize);
        const newCellId = `${newRow}-${newCol}`;
        const newCell = document.getElementById(newCellId);
        if (newCell) {
            newCell.appendChild(draggedPiece);
            draggedPiece.style.position = 'absolute';
            updatePiecePosition(draggedPiece, newCell);
        } else {
            // Return to original position if drop target is invalid
            const oldCell = document.getElementById(`${draggedPiece.parentNode.row}-${draggedPiece.parentNode.col}`);
            oldCell.appendChild(draggedPiece);
            updatePiecePosition(draggedPiece, oldCell);
        }
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        draggedPiece = null;
    }
}

function updatePiecePosition(pieceElement, cell) {
    pieceElement.style.left = `${cell.offsetLeft}px`;
    pieceElement.style.top = `${cell.offsetTop}px`;
}
