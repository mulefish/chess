// import { board, pieces,  showBoard, init } from "./setup.js";
const { board, pieces, showBoard, init } = require("./setup.js"); 
init()
pieces["bp1"].setRowCol(5,2)

const possible = pieces["wr2"].getPossibleMoves() 
showBoard(possible, [])

// console.log(m )