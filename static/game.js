
const size = window.innerHeight / 10
const top2 = size * 0.3
const left2 = size * 0.8
const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]

class Cell {
    constructor(row, col, css) {
        this.letter = letters[col]
        this.rc = `${row}${letters[col]}`
        this.row = row
        this.col = col
        this.css = css
    }
}

function cellFactory(obj) {
    let visibleNumber = "&nbsp;"
    let visibleLetter = "&nbsp;"
    if (obj.col === 0) {
        visibleNumber = (obj.row + 1)
    }

    if (obj.row === 7) {
        visibleLetter = obj.letter
    }

    let numberCss = ""
    let letterCss = ""

    if (obj.css === "feltgreen") {
        numberCss = "whiteNumber"
        letterCss = "whiteLetter"
    } else {
        numberCss = "greenNumber"
        letterCss = "greenLetter"
    }

    return `<td class=${obj.css} style="height:${size}px; width:${size}px"  onClick="setActive('${obj.rc}');">
            <div class='${numberCss}' style="top:-15px;" >${visibleNumber}</div>
            <div class='${letterCss}' style="top:${top2}px; left:${left2}px">${visibleLetter}</div>

    </td>`
}


let cells = {}
cells['0a'] = new Cell(0, 0, 'feltgreen')
cells['0b'] = new Cell(0, 1, 'offwhite')
cells['0c'] = new Cell(0, 2, 'feltgreen')
cells['0d'] = new Cell(0, 3, 'offwhite')
cells['0e'] = new Cell(0, 4, 'feltgreen')
cells['0f'] = new Cell(0, 5, 'offwhite')
cells['0g'] = new Cell(0, 6, 'feltgreen')
cells['0h'] = new Cell(0, 7, 'offwhite')
cells['1a'] = new Cell(1, 0, 'offwhite')
cells['1b'] = new Cell(1, 1, 'feltgreen')
cells['1c'] = new Cell(1, 2, 'offwhite')
cells['1d'] = new Cell(1, 3, 'feltgreen')
cells['1e'] = new Cell(1, 4, 'offwhite')
cells['1f'] = new Cell(1, 5, 'feltgreen')
cells['1g'] = new Cell(1, 6, 'offwhite')
cells['1h'] = new Cell(1, 7, 'feltgreen')
cells['2a'] = new Cell(2, 0, 'feltgreen')
cells['2b'] = new Cell(2, 1, 'offwhite')
cells['2c'] = new Cell(2, 2, 'feltgreen')
cells['2d'] = new Cell(2, 3, 'offwhite')
cells['2e'] = new Cell(2, 4, 'feltgreen')
cells['2f'] = new Cell(2, 5, 'offwhite')
cells['2g'] = new Cell(2, 6, 'feltgreen')
cells['2h'] = new Cell(2, 7, 'offwhite')
cells['3a'] = new Cell(3, 0, 'offwhite')
cells['3b'] = new Cell(3, 1, 'feltgreen')
cells['3c'] = new Cell(3, 2, 'offwhite')
cells['3d'] = new Cell(3, 3, 'feltgreen')
cells['3e'] = new Cell(3, 4, 'offwhite')
cells['3f'] = new Cell(3, 5, 'feltgreen')
cells['3g'] = new Cell(3, 6, 'offwhite')
cells['3h'] = new Cell(3, 7, 'feltgreen')
cells['4a'] = new Cell(4, 0, 'feltgreen')
cells['4b'] = new Cell(4, 1, 'offwhite')
cells['4c'] = new Cell(4, 2, 'feltgreen')
cells['4d'] = new Cell(4, 3, 'offwhite')
cells['4e'] = new Cell(4, 4, 'feltgreen')
cells['4f'] = new Cell(4, 5, 'offwhite')
cells['4g'] = new Cell(4, 6, 'feltgreen')
cells['4h'] = new Cell(4, 7, 'offwhite')
cells['5a'] = new Cell(5, 0, 'offwhite')
cells['5b'] = new Cell(5, 1, 'feltgreen')
cells['5c'] = new Cell(5, 2, 'offwhite')
cells['5d'] = new Cell(5, 3, 'feltgreen')
cells['5e'] = new Cell(5, 4, 'offwhite')
cells['5f'] = new Cell(5, 5, 'feltgreen')
cells['5g'] = new Cell(5, 6, 'offwhite')
cells['5h'] = new Cell(5, 7, 'feltgreen')
cells['6a'] = new Cell(6, 0, 'feltgreen')
cells['6b'] = new Cell(6, 1, 'offwhite')
cells['6c'] = new Cell(6, 2, 'feltgreen')
cells['6d'] = new Cell(6, 3, 'offwhite')
cells['6e'] = new Cell(6, 4, 'feltgreen')
cells['6f'] = new Cell(6, 5, 'offwhite')
cells['6g'] = new Cell(6, 6, 'feltgreen')
cells['6h'] = new Cell(6, 7, 'offwhite')
cells['7a'] = new Cell(7, 0, 'offwhite')
cells['7b'] = new Cell(7, 1, 'feltgreen')
cells['7c'] = new Cell(7, 2, 'offwhite')
cells['7d'] = new Cell(7, 3, 'feltgreen')
cells['7e'] = new Cell(7, 4, 'offwhite')
cells['7f'] = new Cell(7, 5, 'feltgreen')
cells['7g'] = new Cell(7, 6, 'offwhite')
cells['7h'] = new Cell(7, 7, 'feltgreen')




function createUI() {


    let table = "<table border='0'>"

    for (let k in cells) {
        const obj = cells[k]
        if (obj.col === 0) {
            table += "<tr>"
        }
        table += cellFactory(obj)

        if (obj.col === 7) {
            table += "</tr>"
        }
    }
    table += "</table>"
    document.getElementById("board").innerHTML = table
}

function setActive(x) {
    console.log("whale " + x  )
    document.getElementById("active").innerHTML = x
}

