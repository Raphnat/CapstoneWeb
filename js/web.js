import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    getDatabase, ref, child, get
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuSzs-m6ToSKy5M7RGPT6-whsmajo0iKg",
    authDomain: "soshiok-ip2023.firebaseapp.com",
    databaseURL: "https://soshiok-ip2023-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "soshiok-ip2023",
    storageBucket: "soshiok-ip2023.appspot.com",
    messagingSenderId: "431465307758",
    appId: "1:431465307758:web:bb5b2cf610e7facd1a507f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
const playerRef = ref(db, "players");
getPlayerData();


function getPlayerData() {
    //const playerRef = ref(db, "players");
    //PlayerRef is declared at the top using a constant
    //get(child(db,`players/`))
    get(playerRef)
        .then((snapshot) => {//retrieve a snapshot of the data using a callback
            if (snapshot.exists()) {//if the data exist
                try {
                    //let's do something about it
                    var content = "";
                    snapshot.forEach((childSnapshot) => {//looping through each snapshot
                        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array / forEach
                        console.log("GetPlayerData: childkey " + childSnapshot.key);
                    });
                } catch (error) {
                    console.log("Error getPlayerData" + error);
                }
            }
        });
}//end getPlayerData
