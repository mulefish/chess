let pieces = {};
let activeCell = undefined;
let activePiece = undefined;
let possibleMoves = undefined;
let possibleAttacks = undefined;
let highlighted = [];
let highlightedAttacks = [];
const white = "white"
const black = "black"
let lastMove = null;
let enpassant = []


const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
//this.lastRow, this.lastCol, this.row, this.col, this.id, this.type, this.color
function recordHist(r1, c1, r2, c2, pId, type, color) {

    if (type === "pawnb" || type === "pawnw") {
        // Pawns just get destination 
        const letter = letters[c2]
        const number = 8 - r2
        const move = `${letter}${number}\n`; // Add newline for better readability
        blue(move)
        const histElement = document.getElementById("hist");
        histElement.value += move; // Append move to textarea content
    }
}




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
let emitCount = 0
function yellow(msg) {
    const stack = new Error().stack.split("\n");
    const callerLine = stack[2]?.trim();
    const lineMatch = callerLine.match(/:(\d+):\d+/);
    const funcNameMatch = callerLine.match(/at (\S+)/);

    const line = lineMatch ? lineMatch[1] : "unknown";
    const funcName = funcNameMatch ? funcNameMatch[1] : "anonymous";

    console.log(`%c ${++emitCount} ${line}: ${funcName}: ${msg}`, "background-color:yellow");
}
function blue(msg) {
    const stack = new Error().stack.split("\n");
    const callerLine = stack[2]?.trim();
    const lineMatch = callerLine.match(/:(\d+):\d+/);
    const funcNameMatch = callerLine.match(/at (\S+)/);

    const line = lineMatch ? lineMatch[1] : "unknown";
    const funcName = funcNameMatch ? funcNameMatch[1] : "anonymous";

    console.log(`%c ${line}: ${funcName}: ${msg}`, "background-color:lightblue");
}

function calculateMoves(row, col, moves, recurse) {
    yellow("!")
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
    yellow("!")

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
            enpassant.push(enPassantId)
            yellow("enpassant: " + JSON.stringify(enpassant))
        }
    }

    return accumulator;
}


function calculateAttacks(row, col, moves, recurse, color) {

    yellow("!")
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
    yellow("!")

    // Check if the move is an en passant capture
    if (lastMove && activePiece.type === "pawnw" || activePiece.type === "pawnb") {
        const direction = (activePiece.color === "black") ? -1 : 1;
        if (Math.abs(lastMove.from.split('-')[0] - lastMove.to.split('-')[0]) === 2) {
            if (lastMove.piece.row === row - direction && lastMove.piece.col === col) {
                // Remove the captured pawn
                pieces[lastMove.piece.id].removeFromPlace();
            }
        }
    }

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

    yellow("!")
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
        if (this.moveCount > 1 && (this.type === "pawnb" || this.type === "pawnw")) {
            this.recurse = 1
        }


        const [newRow, newCol] = newLocation.split('-').map(Number);
        this.row = newRow;
        this.col = newCol;


        if ((this.type === "pawnb" || this.type === "pawnw") && this.moveCount > 1) {
            yellow("Pawn")

            const eId = `${this.row}-${this.col}`
            if (enpassant.includes(eId)) {
                blue("YAY!!  " + eId)
                if (this.color === white) {
                    const cellToZap = "3-" + this.col
                    delete pieces[cellToZap]
                    const cell = document.getElementById(cellToZap);
                    if (cell) {
                        cell.innerHTML = ""; // Clear the cell's content
                        const something = cell.removeAttribute('data-piece')
                        if (something !== undefined) {
                            cell.removeAttribute('data-piece'); // Remove the data attribute
                        }
                    }


                } else if (this.color === black) {
                    const cellToZap = "4-" + this.col
                    delete pieces[cellToZap] // 
                    const cell = document.getElementById(cellToZap);
                    if (cell) {
                        cell.innerHTML = ""; // Clear the cell's content
                        const something = cell.removeAttribute('data-piece')
                        if (something !== undefined) {
                            cell.removeAttribute('data-piece'); // Remove the data attribute
                        }
                    }
                }

            }
        }



        // Update last move
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
        yellow("!")

        const cell = document.getElementById(this.cellId);
        if (cell) {
            cell.innerHTML = ""; // Clear the cell's content
            const something = cell.removeAttribute('data-piece')
            if (something !== undefined) {
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

//// 


function handleCellClick(event) {
    yellow("!")


    if (event.target.tagName === 'TD' && event.target.classList.contains('cell')) {
        const row = event.target.getAttribute('data-row');
        const col = event.target.getAttribute('data-col');
        activeCell = event.target.getAttribute('id');

        if (highlightedAttacks.includes(activeCell)) {
            const attackedPiece = event.target.getAttribute('data-piece');
            placeAttackingPiece(row, col, activePiece, attackedPiece)
        } else {
            if (highlighted.includes(activeCell) && activePiece !== undefined && activePiece.length > 1) {
                placingPiece(row, col);
            } else {
                selectingPiece();
            }
        }
    }
}

document.querySelector('table').addEventListener('click', handleCellClick);

function placingPiece(row, col) {

    yellow("!")

    // Move the piece
    pieces[activePiece].removeFromPlace();
    const newLocation = `${row}-${col}`;
    pieces[activePiece].placePiece(newLocation);

    // Reset active state and clear highlights
    activePiece = undefined;
    removeHighlightFromCells(highlighted);
    removeHighlightAttackFromCells(highlightedAttacks);

    highlighted = [];
    highlightedAttacks = [];
}

function placeAttackingPiece(row, col, attackingPieceKey, attackedPieceKey) {


    yellow("!")

    // Identify the fromCell and toCell
    const fromCell = pieces[attackingPieceKey].cellId;
    const toCell = `${row}-${col}`; // Target cell determined from row and col

    // Remove the attacked piece from the toCell
    const attackedCell = document.getElementById(toCell);
    if (attackedCell) {
        attackedCell.innerHTML = ""; // Clear the target cell
        attackedCell.removeAttribute('data-piece'); // Remove data-piece attribute
        if (attackedPieceKey) {
            console.log(`Removing attacked piece "${attackedPieceKey}" from "${toCell}"`);

            delete pieces[attackedPieceKey]; // Remove the attacked piece from the pieces object
        }
        console.log(`Highlights cleared. Ready for next action.`);
    } else {
        console.warn(`Target cell "${toCell}" not found.`);
    }

    // Remove the attacking piece from the fromCell
    const attackingCell = document.getElementById(fromCell);
    if (attackingCell) {
        attackingCell.innerHTML = ""; // Clear the current cell
        attackingCell.removeAttribute('data-piece'); // Remove data-piece attribute
    } else {
        console.warn(`From cell "${fromCell}" not found.`);
    }

    // Place the attacking piece in the toCell
    pieces[attackingPieceKey].placePiece(toCell);

    // Reset active state and clear highlights
    activePiece = undefined;
    removeHighlightFromCells(highlighted);
    removeHighlightAttackFromCells(highlightedAttacks);

    highlighted = [];
    highlightedAttacks = [];
}


function selectingPiece() {


    yellow("!")

    activePiece = event.target.getAttribute('data-piece');
    if (activePiece !== undefined && activePiece.length > 1) {
        document.getElementById("activeCell").innerHTML =
            "activeCell=" + activeCell + " activePiece=" + activePiece;

        // Clear previous highlights
        removeHighlightFromCells(highlighted);
        removeHighlightAttackFromCells(highlightedAttacks);

        highlighted = [];
        highlightedAttacks = [];

        // Highlight moves and attacks
        possibleMoves = pieces[activePiece].getReachableCells();
        possibleAttacks = pieces[activePiece].getAttackableCells();
        highlightCells(possibleMoves);
        highlightAttackableCells(possibleAttacks);
    } else {
        document.getElementById("activeCell").innerHTML = "activeCell=" + activeCell;
    }
}

function removeHighlightFromCells(cellIds, highlightClass = "highlight") {


    yellow("!")

    cellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.remove(highlightClass);
        } else {
            console.warn(`Cell with ID "${cellId}" not found.`);
        }
    });
}

function removeHighlightAttackFromCells(cellIds, highlightClass = "highlightAttack") {
    yellow("!\n")
    emitCount = 0 
    cellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.remove(highlightClass);
        } else {
            console.warn(`Cell with ID "${cellId}" not found.`);
        }
    });
}

function highlightCells(cellIds, highlightClass = "highlight") {


    yellow("!")

    cellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.add(highlightClass);
            if (!highlighted.includes(cellId)) {
                highlighted.push(cellId);
            }
        } else {
            console.warn(`Cell with ID "${cellId}" not found.`);
        }
    });
}

function highlightAttackableCells(cellIds, highlightClass = "highlightAttack") {


    yellow("!")


    cellIds.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.add(highlightClass);
            if (!highlightedAttacks.includes(cellId)) {
                highlightedAttacks.push(cellId);
            }
        } else {
            console.warn(`Cell with ID "${cellId}" not found.`);
        }
    });
}



new Piece("br1", 0, 0, "♜", black, "rook", 8);
new Piece("bn1", 0, 1, "♞", black, "knight", 1);
new Piece("bb1", 0, 2, "♝", black, "bishop", 8);
new Piece("bq", 0, 3, "♛", black, "queen", 8);
new Piece("bk", 0, 4, "♚", black, "king", 1);
new Piece("bb2", 0, 5, "♝", black, "bishop", 8);
new Piece("bn2", 0, 6, "♞", black, "knight", 1);
new Piece("br2", 0, 7, "♜", black, "rook", 8);
new Piece("bpawn3", 1, 7, "♟", black, "pawnb", 2);
new Piece("bpawn2", 1, 6, "♟", black, "pawnb", 2);
new Piece("bpawn1", 1, 5, "♟", black, "pawnb", 2);
new Piece("bpawn4", 1, 4, "♟", black, "pawnb", 2);
new Piece("bpawn5", 1, 3, "♟", black, "pawnb", 2);
new Piece("bpawn6", 1, 2, "♟", black, "pawnb", 2);
new Piece("bpawn7", 1, 1, "♟", black, "pawnb", 2);
new Piece("bpawn0", 1, 0, "♟", black, "pawnb", 2);


new Piece("wr1", 7, 0, "♖", white, "rook", 8);
new Piece("wn1", 7, 1, "♘", white, "knight", 1);
new Piece("wb1", 7, 2, "♗", white, "bishop", 8);
new Piece("wqueen", 7, 3, "Q", white, "queen", 8); // ♕
new Piece("wk", 7, 4, "♔", white, "king", 1);
new Piece("wb2", 7, 5, "♗", white, "bishop", 8);
new Piece("wn2", 7, 6, "♘", white, "knight", 1);
new Piece("wr2", 7, 7, "♖", white, "rook", 8);
new Piece("wpawn1", 6, 0, "♙", white, "pawnw", 2);
new Piece("wpawn2", 6, 1, "♙", white, "pawnw", 2);
new Piece("wpawn3", 6, 2, "♙", white, "pawnw", 2);
new Piece("wpawn4", 6, 3, "♙", white, "pawnw", 2);
new Piece("wpawn5", 6, 4, "♙", white, "pawnw", 2);
new Piece("wpawn6", 6, 5, "♙", white, "pawnw", 2);
new Piece("wpawn7", 6, 6, "♙", white, "pawnw", 2);
new Piece("wpawn7", 6, 7, "♙", white, "pawnw", 2);

function poke() {
    // alert("piece=" + activePiece + "\ncell=" + activeCell);
    console.log("\n\n++++++++++++++++\n")
}
