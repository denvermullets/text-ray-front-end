let gameID = Math.floor(Math.random() * 3) + 1; //will eventually be rand if when have more games
// let gameID = Math.floor(Math.random() * 1) + 3; //will eventually be rand if when have more games
console.log(`game ID ${gameID}`)
let userName; //should be set once user logs in
let keyLetter; //set with getGameLetters
const topLeft = document.querySelector(".top-left") //used for log in box
const fullWordDiv = document.querySelector('.fullWord')
let gameWordIDs = [] //set with getGameWords
let userScore = 0;
let userID; //should be set with getUser fn, not working in line 32
let letterCollection = '' // changed to be a string
let wordCollection = [] // array of user submitted words
let gameUserID;
let leaderboard = []; //array of objects {playername, score} populated by getLeaderboard in descending order




document.addEventListener('DOMContentLoaded', (event) => {
        
    if (!userName) {
        topLeft.innerHTML = `
        <div class="enter-user">
        <label for="uname"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" id="uname">
    
        <button id="submit-user" type="submit">Submit</button>
      </div>
        `
    } //end of if a user is not "signed in"
    
    topLeft.addEventListener("click", function(e){
        e.preventDefault()
        
        if (e.target.id === "submit-user") {
            userName = topLeft.querySelector("#uname").value
            getUser(userName) 
            wordCollection = []
            

         } //end of if target is submit user 
    
        else if (e.target.id === "end-game") {
            topLeft.innerHTML = `
            <div class="enter-user">
            <label for="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" id="uname">
        
            <button id="submit-user" type="submit">Submit</button>
          </div>
            `
            createGameUser()
        } //end of change user listener
    }) // end of user event listener
    
    document.addEventListener("click", function(e){
        if (e.target.className === "boxLetters sansserif"){
            // add letter to string
            letterCollection = letterCollection + e.target.textContent
            // create conveyor belt box w/letter
            createBox(e.target.textContent)

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
            } else {
                // all conditions must be true
                console.log('keyletter found')
                console.log(letterCollection)
                getWordId(letterCollection.toLowerCase())
                wordCollection.push(letterCollection)
                console.log(wordCollection)
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
        getGameLetters(gameID)
        getGameWords(gameID)

        getLeaderboard(gameID)
        console.log(leaderboard)
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
    
    function getWordId(word){
        fetch(`http://localhost:3000/words/${word}`)
        .then(resp => resp.json())
        .then(findWord => {
            let wordNum = findWord.id
            if (gameWordIDs.includes(wordNum)) {
                addWordToScore(findWord.point_value)
            } else {
                
                console.log('word not found')
            }
        }).catch(function() {
            wordNotFound()
            console.log("error");
        })
    }    

    function getLeaderboard(gameID){
        fetch(`http://localhost:3000/game_users`)
        .then(resp => resp.json())
        .then(users => { 
            users.forEach(player => {
                if (player.game_id === gameID) {
                    let uScore = player.score
                    fetch(`http://localhost:3000/user_by_id/${player.user_id}`)
                    .then(resp => resp.json())
                    .then(user => {
                        let leader = {name: user.name, score: uScore} 
                        leaderboard.push(leader)
                    })
                }
            }) 
        }) 
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

function wordNotFound() {
    wordCollection.pop()
    console.log('removed wrong word')
}

function updateScore() {

    console.log('hi')
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