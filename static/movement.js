class Cell {
    constructor(row, col) {
        this.row = row 
        this.col = col 
        this.id = `${row}-${col}`
        this.pieceRef = undefined 
    }
    setPiece(key) {
        this.pieceRef = key 
    }
    getId() {
        if ( this.pieceRef !== undefined ) {
            return " " + this.pieceRef
        } 
        return this.id
    }
}

let board = []
for ( let r = 0; r < 8; r++ )  {
    board[r]=[]
    for ( let c = 0; c < 8; c++) {
        const cell = new Cell(r, c)
        board[r][c]=cell
    }
}

function showBoard() {
    let x = ""
    board.forEach((row)=> { 

        row.forEach((col)=>{
            x += col.getId() + " "
        })
        x += "\n"
    })
    console.log( x )
}
showBoard() 