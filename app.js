const mainBoards = document.querySelector("#main-boards")
mainBoards.addEventListener('click', handleClick)

const infoEl = document.querySelector('#info')
const turnEl = document.querySelector('#turn')


let totalCols = 10
let totalRows = 10

let placingShipIndex = null
let placingDirection = 'horizontal'


let playerHits = new Set()
let playerMisses = new Set()
let computerHits = new Set()
let computerMisses = new Set()
let playerShipsLocation = new Set()
let computerShipsLocation = new Set()

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

const GAME_STATES = {
    SETUP: "setup",
    PLAYER_TURN: 'playerTurn',
    COMPUTER_TURN: 'computerTurn',
    GAME_OVER: 'gameOver',
}

let gameState = GAME_STATES.SETUP
infoEl.textContent = `Ladies & Gentlemen, Place your Ships!`
turnEl.textContent = `Loading Weapons...`


function handleClick(e) {
    if(!e.target.classList.contains("square")) return;

    const square = e.target
    let row = Number(square.dataset.row)
    let col = Number(square.dataset.col)
    const boardId = square.parentElement.id // 'player' or 'computer'

    if (gameState === GAME_STATES.GAME_OVER) return;
    if (gameState === GAME_STATES.SETUP) {
        if (boardId !== 'player') return

        if (placingShipIndex === null) {
            fadeInfo("Please Select a Ship!")
            return;
        }

        const placedShip = placeShip(placingShipIndex, placingDirection, row, col, playerShipsLocation)

        if (placedShip) {
            placingShipIndex = null
        }

        render()
        return
    }

    if (gameState === GAME_STATES.PLAYER_TURN) {
        if (boardId === 'computer') {
            playerAttack(row, col)
        }

        if (gameState === GAME_STATES.PLAYER_TURN && boardId !== 'computer') {
            fadeInfo('Attack the enemy board!')
        }
    }

    render()
    return  
      
}

const playerBoard = document.querySelector('#player')
const computerBoard = document.querySelector('#computer')

function render() {
    //clear each render
    const gridElements = document.querySelectorAll('.square')
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
    if (gameState !== GAME_STATES.SETUP) return;
    if (!e.target.classList.contains('option')) 
        return;
    placingShipIndex = shipOptionIndex[e.target.id]
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
    if (gameState !== GAME_STATES.SETUP) return

    const allPlaced = playerShips.every(ship => ship.cells.length === ship.length)
    if (!allPlaced){
        fadeInfo('Place all ships first!')
        return;
    }

    computerShips.forEach((_ship, index) => {
        computerGenerateShips(index, computerShipsLocation)
    })

    gameState = GAME_STATES.PLAYER_TURN
    fadeInfo("Battle is on!")
    fadeTurn("Your Move, Captain")
    render()
}



//Create Flip Button
const flipButton = document.querySelector('#flip-button')
flipButton.addEventListener('click', flip)

let rotationAngle = 0;

function flip() {
    if (gameState !== GAME_STATES.SETUP) return;
    placingDirection === 'horizontal' ? placingDirection = 'vertical' : placingDirection = 'horizontal'
    const shipOptions = Array.from(optionsContainer.children)
    rotationAngle += 90;
    shipOptions.forEach(ship => ship.style.transform = `rotate(${rotationAngle}deg)`)
}

// Creating Ships (Game state)

const playerShips = [
    {
        shipname: 'destroyer',
        length: 2,
        cells: [],
    },

    {   
        shipname: 'cruiser',
        length: 3,
        cells: [],
    },

    {
        shipname: 'submarine',
        length: 3,
        cells: [],
    },
    
    {
        shipname: 'battleship',
        length: 4,
        cells: [],
    },
    
    {   
        shipname: 'carrier',
        length: 5,
        cells: [],
    }
]

const computerShips = [
  {
    shipname: 'destroyer',
    length: 2,
    cells: [],
  },

  {   
    shipname: 'cruiser',
    length: 3,
    cells: [],
  },

  {
    shipname: 'submarine',
    length: 3,
    cells: [],
  },
  
  {
    shipname: 'battleship',
    length: 4,
    cells: [],
  },
  
  {   
    shipname: 'carrier',
    length: 5,
    cells: [],
  }
]

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

        return true;

    } else {
        fadeInfo("Unable to deploy ships here Captain, Overlap!")
        return false
    }       
}

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
            //vertical placement
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
    if (gameState !== GAME_STATES.PLAYER_TURN) return

    const key = `${row},${col}`

    if (playerHits.has(key) || playerMisses.has(key)) {
        fadeInfo("Position has already been attacked!")
        return       
    }
    
    if (computerShipsLocation.has(key)) {
        playerHits.add(key)
        fadeInfo("Target Hit! Fire another one!")
        checkSunk(key, computerShips, playerHits, "Computer")
        checkWin(computerShips, playerHits, "Player")
        render()
        return;
    
    } else {
        playerMisses.add(key)
        fadeInfo("Target Miss!")
        render()
    }

    if (gameState !== GAME_STATES.GAME_OVER) {
                gameState = GAME_STATES.COMPUTER_TURN

                setTimeout(computerAttack, 1000)
        }
}

function computerAttack() {
    if (gameState !== GAME_STATES.COMPUTER_TURN) return

    while (true) {
        let randomRow = Math.floor(Math.random() * totalRows)
        let randomCol = Math.floor(Math.random() * totalCols)

        const key = `${randomRow},${randomCol}`

        if (computerHits.has(key) || computerMisses.has(key)) continue

        if (playerShipsLocation.has(key)) {
        computerHits.add(key)
        fadeInfo("Mayday! We have been Hit!!")
        checkSunk(key, playerShips, computerHits, "Player")
        checkWin(playerShips, computerHits, "Computer")
        render()
        if (gameState !== GAME_STATES.GAME_OVER) {
            fadeTurn("Computer is thinking...")
            setTimeout(computerAttack, 1000)
            return;
        }

        } else {
        computerMisses.add(key)
        fadeInfo("Better aim next time!")
        }

        if (gameState !== GAME_STATES.GAME_OVER) {
            gameState = GAME_STATES.PLAYER_TURN
            fadeTurn("Your Move, Captain")
        }

        render()
        break
    }
}


function checkSunk(key, userShips, userHits, user) {

    userShips.forEach(ship => {
        let shipCells = ship.cells.map(cell => {
            return `${cell.row},${cell.col}`    
        })
        
        let isHitShip = shipCells.includes(key)

        let shipSunk = shipCells.every(cell => {
            return userHits.has(cell)
        })

        if (isHitShip && shipSunk) {
            fadeInfo(`${user}'s ${ship.shipname} has sunk!`)
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

  if (everyShipSunk) {
    fadeInfo(`All ships have sunk, ${user} has won!`)
    fadeTurn(`Congratulations!`)
    gameState = GAME_STATES.GAME_OVER
  }
}

    
const resetButton = document.querySelector('#reset-button')
resetButton.addEventListener('click', reset)


function reset() {
    gameState = GAME_STATES.SETUP
    playerShips.forEach(ship => {
        ship.cells = []
    })
    computerShips.forEach(ship => {
        ship.cells = []
    })
    rotationAngle = 0
    const shipOptions = Array.from(optionsContainer.children)
    shipOptions.forEach(ship => ship.style.transform = '')
    placingShipIndex = null
    placingDirection = 'horizontal'

    playerHits.clear()
    playerMisses.clear()
    computerHits.clear()
    computerMisses.clear()
    playerShipsLocation.clear()
    computerShipsLocation.clear()
    infoEl.textContent = `Ladies & Gentlemen, Place your Ships!`
    infoEl.classList.remove('hidden')
    turnEl.textContent = `Loading Weapons...`
    turnEl.classList.remove('hidden')
    render()
    }


  function fadeInfo(message) {
    infoEl.classList.add('fade')
    infoEl.textContent = message
    infoEl.classList.remove('fade')
  } 

    function fadeTurn(message) {
    turnEl.classList.add('fade')
    turnEl.textContent = message
    turnEl.classList.remove('fade')
  } 
//----------GRAVEYARD CODE-----------//

// let turn = 'player'
// let gameStarted = false
// let gameOver = false

// function handleClick(e) {
//     if (gameOver) return;
//     if (!e.target.classList.contains('square')) {
//         return;
//     } 
    
//     const square = e.target
//     const row = Number(square.dataset.row)
//     const col = Number(square.dataset.col)

//     const boardId = square.parentElement.id
//     if (boardId === 'player') {
//         if (gameStarted) return;
//         if (placingShipIndex === null) {
//             fadeInfo('Please Select a Ship!') 
//             return;
//         } else {
//         const placedShip = placeShip(placingShipIndex, placingDirection, row, col, playerShipsLocation)
//             if (placedShip) {
//                 placingShipIndex = null              
//             }
//         }

//     } else if (boardId === 'computer') {
//         if (!gameStarted) return;
//         if (turn !== 'player') return;
//         playerAttack(row, col)
//     }
//     render()
// }

// function start() {
//     if (gameStarted) {
//         return
//     }

//     if (playerShips.every(ship => {
//             return ship.cells.length === ship.length
//         })) {
//         computerShips.forEach((_ship, index) => {
//         computerGenerateShips(index, computerShipsLocation)}) //generate computer ships
//         gameStarted = true
//         turn = 'player'
//         fadeInfo("Battle is on!")
//         fadeTurn("Your Move, Captain")

//     }
    
// }

// function playerAttack(row, col) {
//     if (gameOver) return;
//     if (turn !== 'player') return;
    
//     const key = `${row},${col}`


//     if (playerHits.has(key) || playerMisses.has(key)) {
//         fadeInfo("Position has already been attacked!")
//         return;
//     }

//     if (computerShipsLocation.has(key)) {
//         playerHits.add(key)
//         fadeInfo('Target Hit!')
//         checkSunk(key, computerShips, playerHits, 'Computer')
//         checkWin(computerShips, playerHits, 'Player')

//     } else {
//         playerMisses.add(key)
//         fadeInfo('Target Miss!')
//     }

//     if (!gameOver) {
//         turn = 'computer';
//         fadeTurn('Computer is thinking...')
//         setTimeout(computerAttack, 1000)
//     }
    
//     render();
// }

// function checkWin(userShips, userHits, user) {
//     const everyShipSunk = userShips.every(ship => {
//        return ship.cells.every(cell => {
//         let convertedCell = convertCell(cell)
//         return userHits.has(convertedCell)
//        })
//     })

//     if(everyShipSunk) {
//     fadeInfo(`All ships have sunk, ${user} has won!`)
//     fadeTurn(`Congratulations!`)
//         gameOver = true

//     }
// }

// function computerAttack() {
//     if (gameOver) return;
//     if (turn !== 'computer') return;
    
//     while (true) {
//     let randomRow = Math.floor(Math.random() * totalRows)
//     let randomCol = Math.floor(Math.random() * totalCols)

//     const key = `${randomRow},${randomCol}`

//         if (computerHits.has(key) || computerMisses.has(key)) {
//             continue;
//         }

//         if (playerShipsLocation.has(key)) {
//             computerHits.add(key)
//             fadeInfo('Mayday! We have been Hit!!')
//             checkSunk(key, playerShips, computerHits, 'Player')
//             checkWin(playerShips, computerHits, 'Computer')

//         } else {
//             computerMisses.add(key)
//             fadeInfo('Better aim next time!')
//         } 

//         if (!gameOver) {
//             turn = 'player';
//           fadeTurn("Your Move, Captain")
//         }
  
//         render();
//         break;
//     }   
// }