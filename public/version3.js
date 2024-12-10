function getPossibleMoves(type) {
    let moves = [];
    switch (type) {
        case 'rook':
            moves = [[-1, 0], [1, 0], [0, -1], [0, 1]]
            break;
        case 'knight':
            moves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
            break;
        case 'bishop':
            moves = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
            break;
        case 'queen':
            moves = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
            break;
        case 'king':
            moves = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
            break;
        case 'pawnb':
            moves = [[1, 0]]
            break;
        case 'pawnw':
            moves = [[-1, 0]]
            break;
    }
    return moves;
}

function yellow(msg) {
    console.log("%c " + msg, "background-color:yellow")
}
function blue(msg) {
    console.log("%c " + msg, "background-color:lightblue")
}

function calculateMoves(row, col, moves, recurse) {
    function checkit(r1, c1, r2, c2, limit, accumulator) {
        if (limit < 1) {
            return accumulator;
        }
        const y = r1 + r2;
        const x = c1 + c2;
        if (y >= 0 && y < 8 && x >= 0 && x < 8) {
            const id = `${y}-${x}`;
            if (!accumulator.includes(id)) {
                const potentialPiece = document.getElementById(id).getAttribute('data-piece')
                if (potentialPiece == undefined || potentialPiece.length < 1) {
                    // Avoid moving untop another piece. 
                    // Attacks will be dealt with seperately ( mostly because pawns are tricky )
                    accumulator.push(id);
                    checkit(y, x, r2, c2, limit - 1, accumulator);
                } else {
                    return accumulator
                }
            }
        }
    }

    let accumulator = [];
    for (let i = 0; i < moves.length; i++) {
        const arr = moves[i];
        const rowDirection = arr[0];
        const colDirection = arr[1];
        checkit(row, col, rowDirection, colDirection, recurse, accumulator);
    }
    return accumulator;
}

function calculateAttacksForPawns(row, col, moves, recurse, color) {
    const accumulator = [];
    const direction = (color === "black") ? 1 : -1; // Black moves down, white moves up

    // Check diagonal left
    const leftId = `${row + direction}-${col - 1}`;
    const leftPiece = document.getElementById(leftId)?.getAttribute('data-piece');
    if (leftPiece && pieces[leftPiece].color !== color) {
        accumulator.push(leftId);
    }

    // Check diagonal right
    const rightId = `${row + direction}-${col + 1}`;
    const rightPiece = document.getElementById(rightId)?.getAttribute('data-piece');
    if (rightPiece && pieces[rightPiece].color !== color) {
        accumulator.push(rightId);
    }

    // En Passant
    if (
        lastMove && 
        lastMove.piece.type === "pawnb" || lastMove.piece.type === "pawnw" // Last move was a pawn
    ) {
        const lastMoveDirection = (lastMove.piece.color === "black") ? -1 : 1;
        const lastMoveRow = parseInt(lastMove.to.split('-')[0], 10);
        const lastMoveCol = parseInt(lastMove.to.split('-')[1], 10);

        // Check if last move was a two-square move and adjacent to this pawn
        if (
            Math.abs(lastMove.from.split('-')[0] - lastMove.to.split('-')[0]) === 2 &&
            row === lastMoveRow && 
            Math.abs(col - lastMoveCol) === 1
        ) {
            const enPassantRow = row + direction; // Target row for en passant capture
            const enPassantCol = lastMoveCol; // Target column for en passant capture
            const enPassantId = `${enPassantRow}-${enPassantCol}`;
            accumulator.push(enPassantId);
        }
    }

    return accumulator;
}


function calculateAttacks(row, col, moves, recurse, color) {
    function checkit(r1, c1, r2, c2, limit, accumulator) {
        if (limit < 1) {
            return accumulator;
        }
        const y = r1 + r2;
        const x = c1 + c2;
        if (y >= 0 && y < 8 && x >= 0 && x < 8) {
            const id = `${y}-${x}`;
            if (!accumulator.includes(id)) {
                const potentialPiece = document.getElementById(id).getAttribute('data-piece');
                if (potentialPiece == undefined || potentialPiece.length < 1) {
                    // No piece found; continue exploring this direction
                    checkit(y, x, r2, c2, limit - 1, accumulator);
                } else {
                    // Enemy piece found; add to accumulator and stop further exploration in this direction

                    if (color === white) {
                        if (pieces[potentialPiece].color === black) {
                            accumulator.push(id);
                        }
                    } else if (color === black) {
                        if (pieces[potentialPiece].color === white) {
                            accumulator.push(id);
                        }
                    }
                }
            }
        }
    }

    let accumulator = [];
    for (let i = 0; i < moves.length; i++) {
        const arr = moves[i];
        const rowDirection = arr[0];
        const colDirection = arr[1];
        checkit(row, col, rowDirection, colDirection, recurse, accumulator, color);
    }
    return accumulator;
}


function placingPiece(row, col) {
    // Check if the move is an en passant capture
    blue("placingPieces")
    if (lastMove && activePiece.type === "pawnw" || activePiece.type === "pawnb") {
 yellow("a ")
        const direction = (activePiece.color === "black") ? -1 : 1;
        if (Math.abs(lastMove.from.split('-')[0] - lastMove.to.split('-')[0]) === 2) {
            yellow("b ")
            if (lastMove.piece.row === row - direction && lastMove.piece.col === col) {
                yellow("c ")

                // Remove the captured pawn
                pieces[lastMove.piece.id].removeFromPlace();
            }
        }
    }
    yellow("d ")
    // Move the piece
    pieces[activePiece].removeFromPlace();
    const newLocation = `${row}-${col}`;
    pieces[activePiece].placePiece(newLocation);

    // Reset active state and clear highlights
    activePiece = undefined;
    removeHighlightFromCells(highlighted);
    highlighted = [];
}


function selectingPiece() {
    // Select a piece
    activePiece = event.target.getAttribute('data-piece');
    if (activePiece !== undefined && activePiece.length > 1) {
        document.getElementById("activeCell").innerHTML =
            "activeCell=" + activeCell + " activePiece=" + activePiece;
        removeHighlightFromCells(highlighted);
        highlighted = []; // Clear previous highlights
        highlightedAttacks = [];
        possibleMoves = pieces[activePiece].getReachableCells();
        possibleAttacks = pieces[activePiece].getAttackableCells();
        highlightCells(possibleMoves);
        highlightAttackableCells(possibleAttacks);

    } else {
        document.getElementById("activeCell").innerHTML = "activeCell=" + activeCell;
    }
}

class Piece {
    constructor(id, row, col, icon, color, type, recurse) {
        this.id = id;
        this.row = row;
        this.col = col;
        this.icon = icon;
        this.color = color
        this.type = type;
        this.recurse = recurse;
        this.moveCount = -1
        this.cellId = `${row}-${col}`;
        this.lastRow = undefined
        this.lastCol = undefined

        if (!window.pieces) {
            window.pieces = {};
        }
        pieces[this.id] = this;
        this.placePiece(this.cellId);
        this.moves = getPossibleMoves(type);
    }

    placePiece(newLocation) {
        this.moveCount++;
        this.lastRow = this.row;
        this.lastCol = this.col;
        this.moveCount++
        if ( this.moveCount > 1 ) {
            this.recurse = 1
        }

        const [newRow, newCol] = newLocation.split('-').map(Number);
        this.row = newRow;
        this.col = newCol;
    
        lastMove = {
            piece: this,
            from: `${this.lastRow}-${this.lastCol}`,
            to: newLocation,
            moveCount: this.moveCount
        };
    
        this.cellId = newLocation;
        const cell = document.getElementById(this.cellId);
        if (cell) {
            cell.innerHTML = this.icon; // Place the piece icon
            cell.setAttribute('data-piece', this.id); // Update data-piece attribute
        } else {
            console.error(`Cell with ID "${this.cellId}" not found.`);
        }
    }
    
    removeFromPlace() { 
        const cell = document.getElementById(this.cellId);
        if (cell) {
            cell.innerHTML = ""; // Clear the cell's content
            const something =  cell.removeAttribute('data-piece')
            if ( something !== undefined ) {
                cell.removeAttribute('data-piece'); // Remove the data attribute
            }
        } else {
            console.error(`Cell with ID "${this.cellId}" not found.`);
        }
    }

    getReachableCells() {
            return calculateMoves(this.row, this.col, this.moves, this.recurse);
    }

    getAttackableCells() {
        if (this.type === "pawnb" || this.type === "pawnw") {
            return calculateAttacksForPawns(this.row, this.col, this.moves, this.recurse, this.color);
        } else {
            return calculateAttacks(this.row, this.col, this.moves, this.recurse, this.color);
        }
    }
}