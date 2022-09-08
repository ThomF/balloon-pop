

// #region / game logic and data


//DATA
let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxSize = 180
let highestPopCount = 0
let currentPopCount = 0
let gameLength = 10000
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}
let currentColor = "green"
let possibleColors = ["green", "purple", "pink", "orange"]

function startGame(){
    document.getElementById("game-controls").classList.remove("hidden")
    document.getElementById("main-controls").classList.add("hidden")
    document.getElementById("scoreboard").classList.add("hidden")
    startClock()
    setTimeout(stopGame, gameLength)
}

function startClock(){
    timeRemaining = gameLength
    drawClock()
    clockId = setInterval(drawClock, 1000)
}

function stopClock(){
    clearInterval(clockId)
}

function drawClock(){
    let countdownElm = document.getElementById('countdown')
    countdownElm.innerText = (timeRemaining / 1000).toString()
    timeRemaining -= 1000
}


function inflate(){
    clickCount++
    height += inflationRate
    width += inflationRate
    checkBalloonPop()
    draw()
}

function checkBalloonPop(){
    if(height >= maxSize){
        console.log("pop the balloon")
        let balloonElement = document.getElementById("balloon")
        balloonElement.classList.remove(currentColor)
        getRandomColor()
        balloonElement.classList.add(currentColor)

        document.getElementById("pop-sound").play()

        currentPopCount++
        width = 0
        height = 0
    }
}

function getRandomColor(){
   let i = Math.floor(Math.random() * possibleColors.length);
    currentColor = possibleColors[i]
}

function draw(){
    let balloonElement = document.getElementById("balloon")
    let clickCountElm = document.getElementById("click-count")
    let popCountElem = document.getElementById('pop-count')
    let highPopCountElem = document.getElementById('high-pop-count')

    let playerNameElem = document.getElementById('player-name')

    balloonElement.style.height = height + "px"
    balloonElement.style.width = width + "px"
    
    clickCountElm.innerText = clickCount.toString()
    popCountElem.innerText = currentPopCount.toString()
    highPopCountElem.innerText = currentPlayer.topScore.toString()

    playerNameElem.innerText = currentPlayer.name
}


function stopGame(){
    console.log("GAME OVER") 

    document.getElementById("game-controls").classList.add("hidden")
    document.getElementById("main-controls").classList.remove("hidden")
    document.getElementById("scoreboard").classList.remove("hidden")

    clickCount = 0
    height = 120
    width = 100

    if(currentPopCount > currentPlayer.topScore){
        currentPlayer.topScore = currentPopCount
        savePlayers()
    }
    currentPopCount = 0


    stopClock()
    draw()
    drawScoreBoard()
}
// #endregion
// PLAYERS

let players = []
loadPlayers()


function setPlayer(event){
    event.preventDefault()
    let form = event.target

    let playerName = form.playerName.value

    currentPlayer = players.find(player => player.name == playerName)

    if(!currentPlayer) {
        currentPlayer = {name: playerName, topScore: 0 }
        players.push(currentPlayer)
        savePlayers()
    }
    console.log(currentPlayer)
    form.reset()
    document.getElementById("game").classList.remove("hidden")
    form.classList.add("hidden")
    draw()
    drawScoreBoard()
}

function changePlayer(){
    document.getElementById("playerForm").classList.remove("hidden")
    document.getElementById("game").classList.add("hidden")
}

function savePlayers(){
    window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers(){
    let playersData = JSON.parse(window.localStorage.getItem("players"))
    if(playersData){
        players = playersData
    }
}

function drawScoreBoard(){
    let template = ""

    players.sort((p1, p2)=> p2.topScore - p1.topScore)

    players.forEach(player => {
        template += ` 
        <div class="d-flex space-between">
        <span>
        <span class="material-symbols-outlined">
        supervised_user_circle
        </span>
        ${player.name}
        
    </span>
    <span> ${player.topScore} </span>
</div>

    `
    })

    document.getElementById("players").innerHTML = template

}

drawScoreBoard()