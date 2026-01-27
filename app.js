const mainBoards = document.querySelector("#main-boards")

width = 10;

//Create game boards
function createBoards(user) {
   const gameBoard = document.createElement('div')
    gameBoard.classList.add('game-board')
    gameBoard.id = `${user}`
    mainBoards.append(gameBoard)

    for(let i = 0; i < width * width; i++) {
        const square = document.createElement('div')
        square.classList.add('square')
        square.id = i
        gameBoard.append(square)
    }
}

const playerBoard = createBoards("player")
const computerBoard = createBoards("computer")

//Create Options container

const optionsContainer = document.querySelector('#options-container')

//Create Flip Button
const flipButton = document.querySelector('#flip-button')

flipButton.addEventListener('click', flip)

let rotationAngle = 0;

function flip() {
    const shipOptions = Array.from(optionsContainer.children)
    rotationAngle += 90;
    shipOptions.forEach(ship => ship.style.transform = `rotate(${rotationAngle}deg)`)
}

// All these so far I'm just creating DOM elements and manipulating them by styling

// Creating Ships (Game state)

const playerShips = [
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

const computerShips = [
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
let playerShipsLocation = new Set()
let computerShipsLocation = new Set()


//check if it's valid coordinate (helper function)
function isValidCoord(x, y) {
   return (x >= 0 && x < boardRows && y >= 0 && y < boardCols)
}

//check overlap (helper function)
function overlap(tempShip, userShipsLocation) {
    return tempShip.some(cell => {
        let convertedCell = convertCell(cell)
        return userShipsLocation.has(convertedCell)
    })    
}

//convert inputs to store in shipLocations set (helper function)
function convertCell(cell) {
   return `${cell.row},${cell.col}`  
}


function placeShip(shipIndex, direction, startRow, startCol, userShipsLocation) { 
    let tempShip = []
    let ship = playerShips[shipIndex] 
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
    
    if (!overlap(tempShip, userShipsLocation)) {
        ship.cells = tempShip

        tempShip.forEach(cell => {
            let convertedCell = convertCell(cell)
            userShipsLocation.add(convertedCell)
        })

    } else {
        console.log("Cannot place ship: Overlap!");
    }       
}

placeShip(3, 'horizontal', 1, 1, playerShipsLocation)
// console.log(playerShips[3])
// console.log(playerShipsLocation)



width = 10
height = 10
//generate computer ships
function computerGenerateShips(shipIndex, userShipsLocation) {
    
    while(true) {
        let tempShip = []
        const randomBoolean = Math.random() < 0.5
        const isHorizontal = randomBoolean   
        const ship = computerShips[shipIndex]
        if(isHorizontal) {
            const maxStartRow = height - 1
            const maxStartCol = width - ship.length
            const startRow = Math.floor(Math.random() * (maxStartRow + 1))
            const startCol = Math.floor(Math.random() * (maxStartCol + 1))

            for(let i = 0; i < ship.length; i++) {
                let row = startRow
                let col = startCol + i
                //Don't need to validate since will always generate valid, just leaving it here
                if(isValidCoord(row, col)) {
                    tempShip.push({row,col})
                } else return null;
            }
            
        }  else {
            const maxStartRow = height - ship.length
            const maxStartCol = width - 1
            const startRow = Math.floor(Math.random() * (maxStartRow + 1))
            const startCol = Math.floor(Math.random() * (maxStartCol + 1))

            for(let i = 0; i < ship.length; i++) {
                let row = startRow + i
                let col = startCol
                //Don't need to validate since will always generate valid, just leaving it here
                if(isValidCoord(row, col)) {
                    tempShip.push({row,col})
                } else return null;
            }   
        } 

        if (!overlap(tempShip, userShipsLocation)) {
            ship.cells = tempShip

            tempShip.forEach(cell => {
                let convertedCell = convertCell(cell)
                userShipsLocation.add(convertedCell)
            })
            break;
        }         
    }       
}   
computerGenerateShips(1, computerShipsLocation)
console.log(computerShipsLocation)
console.log(computerShips[1])

