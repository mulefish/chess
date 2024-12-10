
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

                    if ( color === "white") {
                        if ( pieces[potentialPiece].color === "black") {
                            accumulator.push(id);
                        }
                    } else if ( color === "black") {
                        if ( pieces[potentialPiece].color === "white") {
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
        this.cellId = `${row}-${col}`;
        if (!window.pieces) {
            window.pieces = {};
        }
        pieces[this.id] = this;
        this.placePiece(this.cellId);
        this.moves = getPossibleMoves(type);
    }

    placePiece(newLocation) {
        const [newRow, newCol] = newLocation.split('-').map(Number);
        this.row = newRow;
        this.col = newCol;
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
            cell.removeAttribute('data-piece'); // Remove the data attribute
        } else {
            console.error(`Cell with ID "${this.cellId}" not found.`);
        }
    }

    getReachableCells() {
        return calculateMoves(this.row, this.col, this.moves, this.recurse);
    }
    getAttackableCells() { 
        return calculateAttacks(this.row, this.col, this.moves, this.recurse, this.color);
    }
}


