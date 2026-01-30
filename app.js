const mainBoards = document.querySelector("#main-boards")
mainBoards.addEventListener('click', handleClick)

let gameStarted = false
let gameOver = false
let totalCols = 10
let totalRows = 10

//Create game boards
function createBoards(user) {
   const gameBoard = document.createElement('div')
    gameBoard.classList.add('game-board')
    gameBoard.id = `${user}`
    mainBoards.append(gameBoard)

    for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalCols; col++) {

            const square = document.createElement('div')
            square.classList.add('square')
            square.dataset.row = row
            square.dataset.col = col
            gameBoard.append(square)   
        }
    }
}

createBoards("player")
createBoards("computer")

let placingShipIndex = null
let placingDirection = 'horizontal'


function handleClick(e) {
    if (gameOver) return;
    if (!e.target.classList.contains('square')) {
        return;
    } 
    
    const square = e.target
    const row = Number(square.dataset.row)
    const col = Number(square.dataset.col)

    const boardId = square.parentElement.id
    if (boardId === 'player') {
        if (gameStarted) return;
        if (placingShipIndex === null) {
            console.log('select a ship first') 
            return;
        } else {
        const placedShip = placeShip(placingShipIndex, placingDirection, row, col, playerShipsLocation)
            if (placedShip) {
                placingShipIndex = null              
            }
        }

    } else if (boardId === 'computer') {
        if (!gameStarted) return;
        if (turn !== 'player') return;
        playerAttack(row, col)
    }
    render()
}

const playerBoard = document.querySelector('#player')
const computerBoard = document.querySelector('#computer')

function render() {
    //clear each render
    const gridElements = document.querySelectorAll('#player .square')
    gridElements.forEach(grid => {
        grid.classList.remove('destroyer','cruiser','submarine','battleship','carrier','hit','miss')   
    })
    //place ships
    playerShips.forEach(ship => {
        ship.cells.forEach(cell => {
const playerElSquare = playerBoard.querySelector(`div[data-row='${cell.row}'][data-col='${cell.col}']`)
            playerElSquare.classList.add(ship.shipname)
        })
    })
  
    // Computer hit/miss
    computerHits.forEach(hit => {
        const parts = hit.split(',')
        const row = parts[0]
        const col = parts[1]

        const hitSquares = playerBoard.querySelector(`div[data-row='${row}'][data-col='${col}']`)
        hitSquares.classList.add('hit')
    })

    computerMisses.forEach(miss => {
        const parts = miss.split(',')
        const row = parts[0]
        const col = parts[1]

        const missSquares = playerBoard.querySelector(`div[data-row='${row}'][data-col='${col}']`)
        missSquares.classList.add('miss')
    })

        //player hit / miss
    playerHits.forEach(hit => {
        const parts = hit.split(',')
        const row = parts[0]
        const col = parts[1]

        const hitSquares = computerBoard.querySelector(`div[data-row='${row}'][data-col='${col}']`)
        hitSquares.classList.add('hit')
    })

    playerMisses.forEach(miss => {
        const parts = miss.split(',')
        const row = parts[0]
        const col = parts[1]

        const missSquares = computerBoard.querySelector(`div[data-row='${row}'][data-col='${col}']`)
        missSquares.classList.add('miss')
    })
}


//Create Options container
const optionsContainer = document.querySelector('#options-container')
optionsContainer.addEventListener('click', handleOptionsClick)

function handleOptionsClick(e) {
    if (gameStarted) return;
    if (!e.target.classList.contains('option')) 
        return;
    placingShipIndex = shipOptionIndex[e.target.id]
    console.log(placingShipIndex)
}

const shipOptionIndex = {
    destroyer: 0,
    cruiser: 1,
    submarine: 2,
    battleship: 3,
    carrier: 4
}


//Create Start Button
const startButton = document.querySelector('#start-button')
startButton.addEventListener('click', start)

function start() {
    if (gameStarted) {
        return
    }

    if (playerShips.every(ship => {
            return ship.cells.length === ship.length
        })) {
        computerShips.forEach((_ship, index) => {
        computerGenerateShips(index, computerShipsLocation)}) //generate computer ships
        gameStarted = true
        turn = 'player'
        console.log('game started')

    }
    
}

//Create Flip Button
const flipButton = document.querySelector('#flip-button')
flipButton.addEventListener('click', flip)

let rotationAngle = 0;

function flip() {
    placingDirection === 'horizontal' ? placingDirection = 'vertical' : placingDirection = 'horizontal'
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
        cells: [],
        placed: false
    },

    {   
        shipname: 'cruiser',
        length: 3,
        cells: [],
        placed: false
    },

    {
        shipname: 'submarine',
        length: 3,
        cells: [],
        placed: false
    },
    
    {
        shipname: 'battleship',
        length: 4,
        cells: [],
        placed: false
    },
    
    {   
        shipname: 'carrier',
        length: 5,
        cells: [],
        placed: false
    }
]

const computerShips = [
  {
    shipname: 'destroyer',
    length: 2,
    cells: [],
    placed: false
  },

  {   
    shipname: 'cruiser',
    length: 3,
    cells: [],
    placed: false
  },

  {
    shipname: 'submarine',
    length: 3,
    cells: [],
    placed: false
  },
  
  {
    shipname: 'battleship',
    length: 4,
    cells: [],
    placed: false
  },
  
  {   
    shipname: 'carrier',
    length: 5,
    cells: [],
    placed: false
  }
]




let playerHits = new Set()
let playerMisses = new Set()
let computerHits = new Set()
let computerMisses = new Set()
let turn = 'player'
let playerShipsLocation = new Set()
let computerShipsLocation = new Set()


//check if it's valid coordinate (helper function)
function isValidCoord(x, y) {
   return (x >= 0 && x < totalRows && y >= 0 && y < totalCols)
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


function placeShip(placingShipIndex, placingDirection, startRow, startCol, userShipsLocation) { 
    let tempShip = []
    let ship = playerShips[placingShipIndex] 
    for(let i = 0; i < ship.length; i++) {
        if(placingDirection === 'horizontal') {
            let row = startRow
            let col = startCol + i
            if(isValidCoord(row, col)) {
                tempShip.push({row,col})
            } else return false

        } else if (placingDirection === 'vertical') {
            let row = startRow + i
            let col = startCol
            if(isValidCoord(row, col)) {
                tempShip.push({row,col}) 
            } else return false
        } else return false
    }
    if (!overlap(tempShip, userShipsLocation)) {
        ship.cells = tempShip

        tempShip.forEach(cell => {
            let convertedCell = convertCell(cell)
            userShipsLocation.add(convertedCell)
        })
        //ship.placed =true
        return true;

    } else {
        console.log("Cannot place ship: Overlap!");
        return false
    }       
}

// console.log(playerShips[3])
// console.log(playerShipsLocation)



//generate computer ships
function computerGenerateShips(shipIndex, userShipsLocation) {
    
    while(true) {
        let tempShip = []
        const randomBoolean = Math.random() < 0.5
        const isHorizontal = randomBoolean   
        const ship = computerShips[shipIndex]
        if(isHorizontal) {
            const maxStartRow = totalRows - 1
            const maxStartCol = totalCols - ship.length
            const startRow = Math.floor(Math.random() * (maxStartRow + 1))
            const startCol = Math.floor(Math.random() * (maxStartCol + 1))

            for(let i = 0; i < ship.length; i++) {
                let row = startRow
                let col = startCol + i
                //Don't need to validate since will always generate valid, just leaving it here
                if(isValidCoord(row, col)) {
                    tempShip.push({row,col})
                } else return false;
            }
            
        }  else {
            const maxStartRow = totalRows - ship.length
            const maxStartCol = totalCols - 1
            const startRow = Math.floor(Math.random() * (maxStartRow + 1))
            const startCol = Math.floor(Math.random() * (maxStartCol + 1))

            for(let i = 0; i < ship.length; i++) {
                let row = startRow + i
                let col = startCol
                //Don't need to validate since will always generate valid, just leaving it here
                if(isValidCoord(row, col)) {
                    tempShip.push({row,col})
                } else return false;
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


//Attack Phase
function playerAttack(row, col) {
    const key = `${row},${col}`

    if (playerHits.has(key) || playerMisses.has(key)) {
        console.log('already attacked')
        return;
    }

    if (computerShipsLocation.has(key)) {
        playerHits.add(key)
        console.log('Hit!')
        checkSunk(key, computerShips, playerHits)
        checkWin(computerShips, playerHits, 'Player')
        turn = 'computer'


    } else {
        playerMisses.add(key)
        console.log('Miss!')
        turn = 'computeri'
    }
}

function computerAttack() {
    
}


function checkSunk(key, userShips, userHits) {

    userShips.forEach(ship => {
        let shipCells = ship.cells.map(cell => {
            return `${cell.row},${cell.col}`    
        })
        
        let isHitShip = shipCells.includes(key)

        let shipSunk = shipCells.every(cell => {
            return userHits.has(cell)
        })

        if (isHitShip && shipSunk) {
            console.log(`Computer's ${ship.shipname} has sunk!`)
        }
    }) 
}


function checkWin(userShips, userHits, user) {
    const everyShipSunk = userShips.every(ship => {
       return ship.cells.every(cell => {
        let convertedCell = convertCell(cell)
        return userHits.has(convertedCell)
       })
    })

    if(everyShipSunk) {
        console.log(`All ships have sunk, ${user} has won!`)
        gameOver = true

    }
}
    

