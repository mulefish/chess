

const letters = ["a","b", "c", "d", "e","f","g","h"]
function createUI() {
    const eighth = window.innerHeight / 10
    let table = "<table border='1'>"
    let i = 0 
    for ( let row = 0; row < 8; row++ ) {
        table += "<tr>"
        for ( let col = 0; col < 8; col++ ) {
            const css = i % 2 === 0 ? "feltgreen" : "offwhite"
            const ltr = `${row}${letters[col]}`
            table += `<td>
                <div class='${css}'>
                ${ltr}
                </div>
            </td>`
            i++
        }
        i++
        table += "</tr>"
    }
    table += "</table>"
    document.getElementById("board").innerHTML = table 
    console.log( table )

}