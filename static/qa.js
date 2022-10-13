const ROOK = "rook"
const KNIGHT = "knight"
const BISHOP = "bishop"
const QUEEN = "queen"
const KING = "king"
const PAWN = "pawn"
const WHITE = "white"
const BLACK = "black"
let pieces = {}
let dom_to_value = {}
let value_to_dom = {}
const NILL = undefined
const cells = {}
class Cell {
    constructor(col, row, number, css ) {
        this.row = row
        this.col = col 
        this.domId = col + "_" + row 
        this.number = number
        this.css = css 
        this.pieceKey = NILL
    }
    getNumber() { 
        return this.number
    }
    getDomId() { 
        return this.domId
    }
    getPiece() {
        return this.pieceKey
    }
    setPiece(key) {
        this.pieceKey = key
    }
    getHtml() {
        return `<td id="${this.domId}" onClick="setActive(this);" class="${this.css}" align="center" valign="center">${this.domId} ${this.number}</td>`
    }
}

function buildCells() {
    let number = 1 
    let tick = 1
    for ( let row = 1; row < 9; row++ ) { 
        for ( let col = 1; col < 9; col++ ) { 
            const css = tick % 2 === 0 ? "feltgreen" : "offwhite"
            const c = new Cell(col, row, number, css)
            cells[c.getDomId()] = c
            number++
            tick++
        }
        tick++
    }
    let table = "<table>"
    let i = 0 
    for ( let k in cells ) {
        if ( i === 0 ) { 
            table += "<tr>"
        }
        table += cells[k].getHtml()
        i++
        if ( i === 8 ) {
            table += "</tr>"
            i = 0
        }
    }
    table += "</table>"

    document.getElementById("board").innerHTML = table 
}


class Piece {
    constructor(color, kind, row, col, moves, attacks) {
        this.color = color;
        this.kind = kind;
        this.row = row;
        this.col = col;
        this.moves = moves
        // Movement special for pawns and knights
        if (kind === KNIGHT || kind === PAWN) {
            this.recurse = 1
        } else {
            this.recurse = 8
        }
        // Special for pawns: their attacks are different from their moves
        if (attacks === undefined) {
            this.attacks = moves
        } else {
            this.attacks = attacks
        }
    }
    getCellId() {
        return this.row + "_" + this.col
    }
    getHtml() {
        return `<i class='fas fa-chess-${this.kind}' style='font-size:36px;color:${this.color}'></i>`
    }
}

function setup() {
    pieces["br1"] = new Piece(BLACK, ROOK, 1, 1, [8, -8, -1, 1])
    pieces["bk1"] = new Piece(BLACK, KNIGHT, 2, 1, [6, -6, 15, 17, 10, -6, -15, -17])
    pieces["bb1"] = new Piece(BLACK, BISHOP, 3, 1, [9, -7, -9, 7])
    pieces["bq1"] = new Piece(BLACK, QUEEN, 4, 1, [-1, 7, 8, 9, 1, -7, -8, -9])
    pieces["bk"] = new Piece(BLACK, KING, 5, 1, [-1, 7, 8, 9, 1, -7, -8, -9])
    pieces["bb2"] = new Piece(BLACK, BISHOP, 6, 1, [9, -7, -9, 7])
    pieces["bk2"] = new Piece(BLACK, KNIGHT, 7, 1, [6, -6, 15, 17, 10, -6, -15, -17])
    pieces["br2"] = new Piece(BLACK, ROOK, 8, 1, [8, -8, -1, 1])
    pieces["bp1"] = new Piece(BLACK, PAWN, 1, 2, [-7, 9])
    pieces["bp2"] = new Piece(BLACK, PAWN, 2, 2, [1], [-7, 9])
    pieces["bp3"] = new Piece(BLACK, PAWN, 3, 2, [1], [-7, 9])
    pieces["bp4"] = new Piece(BLACK, PAWN, 4, 2, [1], [-7, 9])
    pieces["bp5"] = new Piece(BLACK, PAWN, 5, 2, [1], [-7, 9])
    pieces["bp6"] = new Piece(BLACK, PAWN, 6, 2, [1], [-7, 9])
    pieces["bp7"] = new Piece(BLACK, PAWN, 7, 2, [1], [-7, 9])
    pieces["bp8"] = new Piece(BLACK, PAWN, 8, 2, [1], [-7, 9])

    //
    pieces["wp1"] = new Piece(WHITE, PAWN, 1, 7, [-1], [-9, 7])
    pieces["wp2"] = new Piece(WHITE, PAWN, 2, 7, [-1], [-9, 7])
    pieces["wp3"] = new Piece(WHITE, PAWN, 3, 7, [-1], [-9, 7])
    pieces["wp4"] = new Piece(WHITE, PAWN, 4, 7, [-1], [-9, 7])
    pieces["wp5"] = new Piece(WHITE, PAWN, 5, 7, [-1], [-9, 7])
    pieces["wp6"] = new Piece(WHITE, PAWN, 6, 7, [-1], [-9, 7])
    pieces["wp7"] = new Piece(WHITE, PAWN, 7, 7, [-1], [-9, 7])
    pieces["wp8"] = new Piece(WHITE, PAWN, 8, 7, [-1], [-9, 7])
    pieces["wr1"] = new Piece(WHITE, ROOK, 1, 8, [8, -8, -1, 1])
    pieces["wk1"] = new Piece(WHITE, KNIGHT, 2, 8, [6, -6, 15, 17, 10, -6, -15, -17])
    pieces["wb1"] = new Piece(WHITE, BISHOP, 3, 8, [9, -7, -9, 7])
    pieces["wq1"] = new Piece(WHITE, QUEEN, 4, 8, [-1, 7, 8, 9, 1, -7, -8, -9])
    pieces["wk"] = new Piece(WHITE, KING, 5, 8, [-1, 7, 8, 9, 1, -7, -8, -9])
    pieces["wb2"] = new Piece(WHITE, BISHOP, 6, 8, [9, -7, -9, 7])
    pieces["wk2"] = new Piece(WHITE, KNIGHT, 7, 8, [6, -6, 15, 17, 10, -6, -15, -17])
    pieces["wr2"] = new Piece(WHITE, ROOK, 8, 8, [8, -8, -1, 1])

    console.log("setup ")
    for (let k in pieces) {
        document.getElementById(pieces[k].getCellId()).innerHTML = pieces[k].getHtml()
    }

    let number = 1
    for (let row = 1; row < 9; row++) {
        for (let col = 1; col < 9; col++) {
            let id = row + "_" + col
            // document.getElementById(id).innerHTML = number + " " + id
            value_to_dom[number] = id
            dom_to_value[id] = number
            number++
        }
    }
}

function setActive(domNode) {
    document.getElementById('activeCell').innerHTML = domNode.id
    let foundPieceKey = undefined;
    const cell = cells[domNode.id]
    for (let k in pieces) {
        if (pieces[k].getCellId() === domNode.id) {
            foundPieceKey = k
            continue
        }
    }
    if (foundPieceKey !== undefined) {

        document.getElementById("activePiece").innerHTML = foundPieceKey
        const piece = pieces[foundPieceKey]
        const domId = piece.getCellId()
        const numId = dom_to_value[domId]


        console.log("p=" + foundPieceKey + " number=" + numId + " getNumber=" + cell.getNumber() + " piece: " + JSON.stringify( piece ))
        step1(piece, numId, domId)

    } else {
        console.log("nope! cell=" + domNode.id + " number=" + cell.getNumber())
        document.getElementById("activePiece").innerHTML = ""
    }
}

function step1(piece, numId, domId) {
    let possible = [] 
    piece.moves.forEach((move, i)=> { 
        const x = step2( move, 0, numId, piece.recurse, [] )
        possible = possible.concat( x )
    })


    // let possible = step2( -1, 0, 30, 8, [] )
    ///    console.log( piece.moves, numId, domId, possible)
    console.log( "numId=" + numId + " domId="+ domId + " possible=" + JSON.stringify(possible)) 



    for ( let domId in dom_to_value ) { 
        document.getElementById(domId).classList.remove("possible");
    }


    possible.forEach((candidate)=> { 
        const dId = value_to_dom[candidate]
        document.getElementById(dId).classList.add("possible");

    })

} 

function step2(move, loop, pov, limit, ary ) {
    
    if ( loop < limit ) {
        pov += move


        if ( value_to_dom.hasOwnProperty(pov)) { 
            ary.push(pov)
            loop++
            step2(move, loop, pov, limit, ary)
        }
    } 
    return ary




}