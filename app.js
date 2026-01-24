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






