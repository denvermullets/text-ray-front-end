let gameID = Math.floor(Math.random() * 3) + 5; //will eventually be rand if when have more games
let userName; //should be set once user logs in
let keyLetter; //set with getGameLetters
const topLeft = document.querySelector(".top-left") //used for log in box
const fullWordDiv = document.querySelector('.fullWord')
let gameWordIDs = [] //set with getGameWords
let userScore = 0;
let userID; //should be set with getUser fn, not working in line 32
let letterCollection = []


document.addEventListener('DOMContentLoaded', (event) => {

    getGameLetters(gameID)
    getGameWords(gameID)
    
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

         } //end of if target is submit user 
    
        else if (e.target.id === "change-user") {
            topLeft.innerHTML = `
            <div class="enter-user">
            <label for="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" id="uname">
        
            <button id="submit-user" type="submit">Submit</button>
          </div>
            `
        } //end of change user listener
    }) // end of user event listener
    
    document.addEventListener("click", function(e){
        if (e.target.className === "boxLetters sansserif"){
            letterCollection.push(e.target.textContent)
            
            createBox(e.target.textContent)

        } else if (e.target.className === "submit-word") {
            if (letterCollection.includes(keyLetter)) {
                let submission = letterCollection.join("").toLowerCase()
                if (submission.length > 3) {
                letterCollection = [] // resets array
                submissionID = getWordId(submission)
            
                answerAnimationCorrect()

                } // end of length confirmed
                else {
                    letterCollection = [] // resets array
                    alert("Word must contain more than 3 letters")
                } // end of short word error
                
        } // end of key letter confirm
        else { 
            letterCollection = [] // resets array
            alert("Word must contain the key letter!") 
        }
        } // end of submit word listener
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
                createGameUser(userID, gameID)
            }
            createGameUser(userID, gameID)
            changeLoggedInState()
        })
    } 
    
    function addNewUser(userName) {
        let new_user = {name: userName}
        fetch("http://localhost:3000/users", {
        method: 'post',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify(new_user)
        })
        .then(getUser(userName))
        
    } 
    
    function changeLoggedInState(){
        topLeft.innerHTML = `
        <h2> ${userName}</h2>
        <button id="change-user">Change User</button>
        `
    }
    
    function createGameUser() {
       let  new_game_user = {user_id: userID, game_id: gameID, score: 0}
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
        .then(word => {
            let isWordInArray = gameWordIDs.includes(word.id)
            if (isWordInArray){
                addWordToScore(word.point_value)
            }
            console.log(isWordInArray)
        }) 
    } 
    
    function addWordToScore(points){
        console.log(`score was ${userScore}`)
        newScore = userScore + points
        fetch(`http://localhost:3000/game_users/${userID}`, { 
        method: 'patch',
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({score: newScore})
        })
        .then(userScore += points)  
        console.log(console.log(`score is now ${userScore}`))
       
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

function answerAnimationCorrect() {
    animateCSS('.fullWord', 'fadeOutLeft', function() {
        // Do something after animation
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