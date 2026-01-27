// const mainBoards = document.querySelector("#main-boards")

// width = 10;

// //Create game boards
// function createBoards(user) {
//    const gameBoard = document.createElement('div')
//     gameBoard.classList.add('game-board')
//     gameBoard.id = `${user}`
//     mainBoards.append(gameBoard)

//     for(let i = 0; i < width * width; i++) {
//         const square = document.createElement('div')
//         square.classList.add('square')
//         square.id = i
//         gameBoard.append(square)
//     }
// }

// const playerBoard = createBoards("player")
// const computerBoard = createBoards("computer")

// //Create Options container

// const optionsContainer = document.querySelector('#options-container')

// //Create Flip Button
// const flipButton = document.querySelector('#flip-button')

// flipButton.addEventListener('click', flip)

// let rotationAngle = 0;

// function flip() {
//     const shipOptions = Array.from(optionsContainer.children)
//     rotationAngle += 90;
//     shipOptions.forEach(ship => ship.style.transform = `rotate(${rotationAngle}deg)`)
// }

// All these so far I'm just creating DOM elements and manipulating them by styling

// Creating Ships (Game state)

const ships = [
    {
        shipname: 'destroyer',
        length: 2,
        cells: [

        ],
    },

    {   
        shipname: 'cruiser',
        length: 3,
        cells: [

        ],
    },

    {
        shipname: 'submarine',
        length: 3,
        cells: [

        ],
    },
    
    {
        shipname: 'battleship',
        length: 4,
        cells: [

        ],
    },
    
    {   
        shipname: 'carrier',
        length: 5,
        cells: [

        ],
    }
]


let hits = new Set()
let misses = new Set()
let turn = 'player'
const boardRows = 10
const boardCols = 10
let shipsLocation = new Set()

//check if it's valid coordinate (helper function)
function isValidCoord(x, y) {
   return (x >= 0 && x < boardRows && y >= 0 && y < boardCols)
}

//check overlap (helper function)
function overlap(tempShip) {
    return tempShip.some(cell => {
        let convertedCell = convertCell(cell)
        return shipsLocation.has(convertedCell)
    })    
}

//convert inputs to store in shipLocations set (helper function)
function convertCell(cell) {
   return `${cell.row},${cell.col}`  
}


function placeShip(shipIndex, direction, startRow, startCol) { 
    let tempShip = []
    let ship = ships[shipIndex] 
    for(let i = 0; i < ship.length; i++) {
        if(direction === 'horizontal') {
            let row = startRow
            let col = startCol + i
            if(isValidCoord(row, col)) {
                tempShip.push({row,col})
            } else return null;
        } else if (direction === 'vertical') {
            let row = startRow + i
            let col = startCol
            if(isValidCoord(row, col)) {
                tempShip.push({row,col}) 
            } else return null;
        } else return null;
    }
    
    if (!overlap(tempShip)) {
        ship.cells = tempShip

        tempShip.forEach(cell => {
            let convertedCell = convertCell(cell)
            shipsLocation.add(convertedCell)
        })

    } else {
        console.log("Cannot place ship: Overlap!");
    }       
}

placeShip(3, 'horizontal', 2, 2)



console.log(shipsLocation)

console.log(ships[3])