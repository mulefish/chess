class Piece {
    constructor(key, color, icon, row, col, recurseDepth) {
        this.key = key
        this.color = color
        this.icon = icon
        this.row = row;
        this.col = col;
        this.recurseDepth
        this.moves = getPossibleMoveArrays(icon)
    }

    placeOnBoard() {
        const cellId = `${this.row}-${this.col}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.innerHTML = "<span class='chess-piece'>" + this.icon + "</span>";
            cell.piece = this;
        } else {
            console.log(`Cell with id ${cellId} not found`);
        }
    }
}

function isValidMove(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }



  
let possibleMoves = [] 
function addClickListeners() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.piece) {
                 possibleMoves = getPossibleMoves(cell.piece);
                console.log(`YAY Clicked on cell: ${cell.id}, Piece: ${cell.piece.icon} key: ${cell.piece.key} and ` + JSON.stringify( possibleMoves));
                highlightCells(possibleMoves);

            } else {
                // console.log(`BOO Clicked on cell: ${cell.id}`);
            }
        });
    });
}
let pieces = {}
document.addEventListener('DOMContentLoaded', () => {
    pieces = getPieces()
    let keys = Object.keys(pieces)
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        pieces[k].placeOnBoard()
    }
    // Adding click event listeners
    addClickListeners();
});

function getPossibleMoves(piece) {
    // const [startRow, startCol] = piece.location;
    const startRow  = piece.row 
    const startCol = piece.col
    const possibleMoves = [];
  
    function recurse(row, col, direction, depth) {
      if (depth === 0) return;
  
      const [dr, dc] = direction;
      const newRow = row + dr;
      const newCol = col + dc;
  
      if (!isValidMove(newRow, newCol)) return;
  
      const targetCell = newRow + "-" + newCol;
    //   if (targetCell.color === piece.color) {
    //     return; // Stop recursion for same-color cells
    //   }
  
      possibleMoves.push([newRow, newCol]);
  
      if (targetCell.pieceId && targetCell.color !== piece.color) {
        console.log(`Piece captured: ${targetCell.kind} at [${newRow}, ${newCol}]`);
        return; // Stop recursion for different-color cells
      }
  
      recurse(newRow, newCol, direction, depth - 1);
    }
  
    for (const direction of piece.moves) {
      recurse(startRow, startCol, direction, piece.recurseCount);
    }
  
    return possibleMoves;
  }
 
// Function to highlight cells based on possible moves
function highlightCells(possibleMoves) {
    const cells = document.querySelectorAll('.grid-cell');
    // Remove any previous highlights
    cells.forEach(cell => {
        cell.classList.remove('highlighted');
    });

    // Add new highlights
    possibleMoves.forEach(move => {
        const [row, col] = move;
        const cellId = `${row}-${col}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.add('highlighted');
        }
    });
}
