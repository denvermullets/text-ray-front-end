document.addEventListener('DOMContentLoaded', (event) => {

let userName;
const topLeft = document.querySelector(".top-left")

if (!userName) {
    topLeft.innerHTML = `
    <div class="enter-user">
    <label for="uname"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" id="uname">

    <button id="submit-user" type="submit">Submit</button>
  </div>
    `

} //end of if a user is not "signed in"
else {

} // end of else when user is signed in

topLeft.addEventListener("click", function(e){
    e.preventDefault()
    if (e.target.id === "submit-user") {
        userName = topLeft.querySelector("#uname").value
        getSingleUser(userName)
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
}) // end of  event listener

function addNewUser(userName) {
    new_user = {name: userName}
    fetch("http://localhost:3000/users", {
    method: 'post',
    headers: {
        "accept": "application/json",
        "content-type": "application/json"
    },
    body: JSON.stringify(new_user)
    })
    .then(
        console.log(`added user ${userName}`)
    ) 
}

function changeLoggedInState(){
    topLeft.innerHTML = `
    <h2> ${userName}</h2>
    <button id="change-user">Change User</button>
    `
}


function getSingleUser(userName) {
fetch(`http://localhost:3000/users/${userName}`)
  .then(response => response.json())
  .then(user => {
    if (user){
        // change to logged in state
            changeLoggedInState()
        } //end of if user exists
        else {
            addNewUser(userName)
            changeLoggedInState()
        } // end of else add user
  });
} // end of get single users function 

function getGameLetters(game) {
    fetch(`http://localhost:3000/games/${game}`)
    .then(resp => resp.json())
    .then(game => {
        lettersArr = []
        const letters = game.letters.split("")
        letters.forEach(letter => 
            letters
            )

    })
}


}); // end of DOM Content Loaded 