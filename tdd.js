
let rook = [-8, 8, -1, 1]
let begin = 30 

function step1() {

    let possible = step2( -1, 0, 30, 8, [] )
    console.log( possible)
} 

function step2(move, loop, pov, limit, ary ) {
    
    if ( loop < limit ) {
        pov += move
        ary.push(pov)
        loop++
        step2(move, loop, pov, limit, ary)
    } 
    return ary
}

function merge() { 
    let a = [] 
    let b = [1,2,5,4,5]
    let c = [5,6,7,8,9]
    a = a.concat(b,c)
    console.log(a)
}

step1() 
merge() 