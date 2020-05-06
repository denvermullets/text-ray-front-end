document.addEventListener('DOMContentLoaded', (event) => {

let userNamesArr = []
getAllUsers()

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
        // check if username is in our array
        
                for(var i = 0; i < userNamesArr.length; i++) {
                    if (userNamesArr[i].name == userName) {
                        console.log("exists in DB")
                        break
                    } // end of if username exists in db
                    else { 
                        addNewUser(userName)
                    } // end of else 
                    
                  } // end of check our array for the name 
      
                  // change to logged in state
        topLeft.innerHTML = `
        <h2> ${userName}</h2>
        <button id="change-user">Change User</button>
        `
    }
    else if (e.target.id === "change-user") {
        topLeft.innerHTML = `
        <div class="enter-user">
        <label for="uname"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" id="uname">
    
        <button id="submit-user" type="submit">Submit</button>
      </div>
        `
    } //end of change user listener
}) // end of userName event listener

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
        getAllUsers(),
        console.log(`added user ${userName}`)
    ) 
}

function getAllUsers() {
    userNamesArr = []; //resets array? 
fetch("http://localhost:3000/users")
  .then(response => response.json())
  .then(users => {
   users.forEach(user => {
        userNamesArr.push(user)
   }) //end of for each user
   console.log(userNamesArr)
  });
} // end of get all users function 



}); // end of DOM Content Loaded 