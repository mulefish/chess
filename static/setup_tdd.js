// import { board, pieces,  showBoard, init } from "./setup.js";
const { board, pieces, showBoard, init } = require("./setup.js"); 
init()
pieces["bp1"].setRowCol(5,2)

const possible = pieces["bp1"].getPossibleMoves() 
const possibleAttacks = pieces["bp1"].getPossibleAttacks() 


console.log("possibleAttacks: " + possibleAttacks )
showBoard(possible, possibleAttacks)

// console.log(m )