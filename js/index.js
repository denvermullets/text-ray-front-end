let gameID  //will eventually be rand if when have more games
let userName; //should be set once user logs in
let keyLetter; //set with getGameLetters
const topLeft = document.querySelector(".top-left") //used for log in box
const topRight = document.querySelector(".top-right") //used for log in box
const fullWordDiv = document.querySelector('.fullWord')
let gameWordIDs = [] //set with getGameWords
let userScore = 0
let userID 
let letterCollection = '' // changed to be a string
let wordCollection = [] // array of user submitted words
let gameUserID

let allCurrentGameWords = [] // array of current valid game words to avoid pinging api


document.addEventListener('DOMContentLoaded', (event) => {
    
    startState()
    
    topLeft.addEventListener("click", function(e){
        if (e.target.id === "submit-user") {
            userName = topLeft.querySelector("#uname").value
            if (userName.length > 0) {
                getUser(userName) 
                wordCollection = []
            } else {
                console.log('no username entered')
            }
        } else if (e.target.id === "end-game") {
            createGameUser()
            startState()
        } //end of change user listener
    }) // end of user event listener
    
    document.addEventListener("click", function(e){
        if (e.target.className === "boxLetters sansserif"){
            // add letter to string
            letterCollection = letterCollection + e.target.textContent
            // create conveyor belt box w/letter
            createBox(e.target.textContent)

        } else if (e.target.className === "squareThree"){
            nextGame()

        } else if (e.target.className === "submit-word") {
            if (!letterCollection.includes(keyLetter)) {
                console.log('keyletter not used')
                answerAnimationWrong()
            } else if (letterCollection.length < 4) {
                answerAnimationWrong()
                console.log('less than 4 letters used')
            } else if (wordCollection.includes(letterCollection)) {
                answerAnimationWrong()
                console.log('user already submitted word')
            } else if (!allCurrentGameWords.includes(letterCollection.toLowerCase())) {
                console.log('not a valid word')
                answerAnimationWrong()
            } else {
                // all conditions must be true
                console.log('keyletter found')
                console.log(letterCollection)
                
                wordCollection.push(letterCollection)
                console.log(wordCollection)
                getWordValue(letterCollection)
                
                const submittedWords = document.querySelector('.wordsFound')
                let newLi = document.createElement('li')
                newLi.innerText = capitalizeFirstLetter(letterCollection)
                submittedWords.appendChild(newLi)
                
                answerAnimationCorrect()
            }
        }   
    }) // end of click event listener
    
    
    function getUser(userName) {
        fetch(`http://localhost:3000/users/${userName}`)
        .then(response => response.json())
        .then(user => {
            // if (!user) {
            // will check for null on all data types, 0's won't register - ok for this
            if (user === null) {
                console.log(`couldn't find ${userName}`)
                addNewUser(userName)
            } else {
                userID = user.id
                console.log(`found ${userName} w/id of ${userID}`)
            }
            changeLoggedInState()
        })
    } 
    
    function addNewUser(userName) {
        let new_user = {name: userName}
        fetch("http://localhost:3000/users", {
        method: 'post',
        headers: {
            "accept": "application/json",
            "content-type": "application/json" },
        body: JSON.stringify(new_user) })
            .then(getUser(userName))
    } 
    
    function changeLoggedInState(){
        topLeft.innerHTML = `
        <h2> ${userName}</h2>
        <p class='curScore'>Current score: ${userScore}</p>
        <button id="end-game">End Game</button>
        <button class="submit-word">Submit Word</button>
        <br>
        <h4>Submitted words:</h4>
        <ul class="wordsFound">
        </ul>
        `
        setNewGame()

    }

    function nextGame(){
        createGameUser()
        userScore = 0
        document.querySelector(".curScore").innerText = "Current score: 0"
        document.querySelector(".wordsFound").innerHTML = ""
        wordCollection = []
        setNewGame()
    }

    function setNewGame(){
        let curGame = gameID
        gameID = Math.floor(Math.random() * 3) + 1
        if (gameID === curGame) {
            gameID = Math.floor(Math.random() * 3) + 1 
        } else {
        console.log(`game ID ${gameID}`)
        getGameLetters(gameID)
        getGameWords(gameID)

        loadAllWords(gameID)

        getLeaderboard(gameID)
        }
    }
    
    function createGameUser() {
       let  new_game_user = {user_id: userID, game_id: gameID, score: userScore}
       console.log(new_game_user)
        fetch("http://localhost:3000/game_users", {
        method: 'post',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify(new_game_user)
        })
    }
    
    function getWordValue(word){
        // just pings server to get point_value for word
        fetch(`http://localhost:3000/words/${word}`)
        .then(resp => resp.json())
        .then(findWord => {addWordToScore(findWord.point_value)  
        }).catch(function() {
            wordNotFound()
            console.log(error);
        })
    }    

    function getLeaderboard(gameID){
        fetch(`http://localhost:3000/game_users`)
        .then(resp => resp.json())
        .then(users => { 
            users.forEach(player => {
                if (player.game_id === gameID) {
                    fetch(`http://localhost:3000/user_by_id/${player.user_id}`)
                    .then(resp => resp.json())
                    .then(user => { displayLeaderBoard(`${user.name} - ${player.score}`)
                    // .then(user => {console.log(user)})
                    })
                }
            }) 
        })
        .then(document.querySelector("li").remove()) 
    }
    
    function addWordToScore(points){
        console.log(`score was ${userScore}`)
        userScore += points

        let currentScore = document.querySelector('.curScore')
        currentScore.innerText = `Current score: ${userScore}`

       console.log(`new score is ${userScore}`)
    }
    
    function getGameLetters(gameID) {
        fetch(`http://localhost:3000/games/${gameID}`)
        .then(resp => resp.json())
        .then(game => {
            const letters = game.letters.toUpperCase()
            for (var i = 0; i < letters.length; i++) {
               if (i === 0) {
                   document.querySelector("#six").textContent = letters.charAt(i)
                   keyLetter = letters.charAt(i)
               } 
               else if (i === 1) {
                document.querySelector("#one").textContent = letters.charAt(i)
               }
               else if (i === 2) {
                document.querySelector("#two").textContent = letters.charAt(i)
               }
               else if (i === 3) {
                document.querySelector("#four").textContent = letters.charAt(i)
               }
               else if (i === 4) {
                document.querySelector("#five").textContent = letters.charAt(i)
               }
               else if (i === 5) {
                document.querySelector("#seven").textContent = letters.charAt(i)
               }
               else if (i === 6) {
                document.querySelector("#eight").textContent = letters.charAt(i)
            }
                document.querySelector("#three").textContent = ''
                document.querySelector("#nine").textContent = ''

              } 
        }) 
    } 
    
    function getGameWords(gameID) {
        fetch(`http://localhost:3000/game_words/${gameID}`)
        .then(resp => resp.json())
        .then(words => { 
            words.forEach(word => {
                gameWordIDs.push(word.word_id)
            }) 
        })  
    } 

    
    
    
}); // end of DOM Content Loaded 

function displayLeaderBoard(playerInfo) {

    const newestUL = document.querySelector('.thisGuy')
    let newestLi = document.createElement('li')
    newestLi.innerText = playerInfo
    newestUL.appendChild(newestLi)

}

function loadAllWords(gameID) {
    // looks up each game word for this game
    fetch(`http://localhost:3000/game_words/${gameID}`)
    .then(response => response.json())
    .then(allWords => { allWords.forEach(singleWord => getSingleWord(singleWord.word_id))})
}

function getSingleWord(wordIdNum) {
    // adds all current game winning words to an array for
    fetch('http://localhost:3000/words/')
        .then(response => response.json())
        .then(allWords => {allWords.forEach(singleWord => {
            if (singleWord.id === wordIdNum) {
                allCurrentGameWords.push(singleWord.spelling_word)
                console.log(`added ${singleWord.spelling_word}`)
            }
        })})   
}

function startState() {
    // reset most things back to default values
    topLeft.innerHTML = `
    <div class="enter-user">
    <label for="uname"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" id="uname">

    <button id="submit-user" type="submit">Submit</button>
    <br>
    <p class="wordsFound">Basic rules:<br>
        Make as many words as you can!<br>
        Words must be more than 3 letters<br>
        Words must contain the blue letter</p>
  </div>
    `
    
    allCurrentGameWords.length = 0 // reset current game words array
    userScore = 0
    document.querySelector("#one").textContent = 'T'
    document.querySelector("#two").textContent = 'E'
    document.querySelector("#three").textContent = '-'
    document.querySelector("#four").textContent = 'X'
    document.querySelector("#five").textContent = 'T'
    document.querySelector("#six").textContent = '-'
    document.querySelector("#seven").textContent = 'R'
    document.querySelector("#eight").textContent = 'A'
    document.querySelector("#nine").textContent = 'Y'
}

function wordNotFound() {
    // function probably never gets called now due to refactoring
    wordCollection.pop()
    console.log('removed wrong word')
}

function resetWord() {
    letterCollection = ''
    fullWordDiv.innerHTML = ''
}
    
function createBox(letter) {
    
    let newBox = document.createElement('div')
    if (letter === keyLetter) {
        newBox.className = 'blueBox'
        newBox.innerHTML = `
            <span id="${letter}" class="sansserif blueBoxType">${letter.toUpperCase()}</span>
        `
    } else {
        newBox.className = 'brownBox'
        newBox.innerHTML = `
        <span id="${letter}" class="sansserif boxType">${letter.toUpperCase()}</span>
        `
    }
    newBox.classList.add('animated', 'bounceInRight')
    fullWordDiv.append(newBox)
}

function answerAnimationWrong() {
    animateCSS('.fullWord', 'bounceOutDown', function() {
        // Do something after animation
        resetWord()
      })
}
function answerAnimationCorrect() {
    animateCSS('.fullWord', 'fadeOutLeft', function() {
        // Do something after animation
        
        resetWord()
      })
}

function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}