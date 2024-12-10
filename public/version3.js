function getPossibleMoves(type) {
    let moves = [];
    switch (type) {
        case 'rook':
            moves = [[-1,0], [1,0],  [0,-1], [0,1]]
            break;
        case 'knight':
            moves = [[2, 1],[2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
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
                if ( potentialPiece == undefined || potentialPiece.length < 1 ) {
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
    console.log(accumulator);
    return accumulator;
}
