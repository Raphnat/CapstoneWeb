
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    getDatabase, ref, set
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

//[STEP 1] Get our database reference
const db = getDatabase();


//[STEP 2] Setup our Create using "set"
//=================================================
var currentTimestamp = new Date().getTime();
var playerData = {
    active: true,
    createdOn: currentTimestamp,
    displayName: "testPlayer",
    email: "someemail@email.com",
    lastLoggedIn: currentTimestamp,
    updatedOn: currentTimestamp,
    userName: "some user name",
};
set(ref(db, `players/${userId}`), playerData);
onValue(playerRef, (snapshot) => {
    //const data = snapshot.val();
    updatePlayerContent(snapshot);
});

