import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    getDatabase, ref, child, get
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";


//[STEP 1] Get our database reference
const db = getDatabase();
//[STEP 2] Setup our node/path reference
const playerRef = ref(db, "PlayerStats");
//[STEP 3] Setup our event listener
var readBtn = document
document.getElementById("btn-read").addEventListener("click", getPlayerData);


//[STEP 4] Setup our player function to display info
function getPlayerData(e) {
    e.preventDefault();
    //playerRef is declared at the top using a constant
    //const playerRef = ref(db, "players");
    //get(child(db,`players/`))
    get(playerRef).then((snapshot) => { //retrieve a snapshot of the data using a callback
        if (snapshot.exists()) {
            //if the data exist
            try {
                //let's do something about it
                var playerContent = document.getElementById("player-content");
                var content = "";
                snapshot.forEach((childSnapshot) => {
                    //looping through each snapshot
                    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
                    console.log("User key: " + childSnapshot.key);
                    console.log("Username: " + childSnapshot.child("username").val());
                    content += `<tr>
                    <td>Username: ${childSnapshot.child("userName").val()}</td>
                    <td>Wrong Tries: ${childSnapshot.child("fails").val()}</td>
                    <td>Time taken: ${childSnapshot.child("lowTimer").val().toFixed(2) + "s"}</td>

                    </tr>`;
                    //======= insert your own place to update UI
                });
                //update our table content
                playerContent.innerHTML = content;
            } catch (error) {
                console.log("Error getPlayerData" + error);
            }
        } 
        else {
            console.log("Snapshot does not exit")
            
        }
    });
} //end getPlayerDat