function getPossibleMoves(type) {
    let moves = [];
    switch (type) {
        case 'rook':
            moves = [[1, 0], [0, 1], [-1, 0], [0, -1]]
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



function calculateMoves(row, col, moves, recurse, visited = new Set()) {

    if (recurse === 0) return []; // Base case: no more moves left

    let possibleCells = [];
    visited.add(`${row}-${col}`); // Mark current cell as visited

    for (const [dr, dc] of moves) {
        const newRow = row + dr;
        const newCol = col + dc;
        const cellId = `${newRow}-${newCol}`;

        // Ensure within bounds and not already visited
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !visited.has(cellId)) {
            possibleCells.push(cellId); // Add valid move
            possibleCells.push(
                ...calculateMoves(newRow, newCol, moves, recurse - 1, visited) // Recur to find further moves
            );
        }
    }

    return possibleCells;
}
