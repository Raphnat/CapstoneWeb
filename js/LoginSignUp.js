import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase,ref,set,child } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const auth = getAuth(app);

let registerBtn = document.getElementById("register");
registerBtn.addEventListener("click", register);

// Set up our register function
function register() {
  // Get all our input fields
  let email = document.getElementById('email').value
  let password = document.getElementById('password').value
  let full_name = document.getElementById('full_name').value
  let hawker_code = document.getElementById('hawker_code').value


  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }
  if (validate_field(full_name) == false) {
    alert('One or More Extra Fields is Outta Line!!')
    return
  }

  // Move on with Auth
  createUserWithEmailAndPassword(auth, email, password)

    .then(function() {
      // Declare user variable
      var user = auth.currentUser


    //const db = getDatabase();
  set(ref(database, 'users/' +  user.uid), {
    email: email,
    password: password,
    full_name: full_name,
    hawker_code :hawker_code,
  })
    .then(() => {
      // Data saved successfully!
      alert('user created successfully')
    })
    .catch((error) => {
      // The write failed...
      alert('error')
    });

      
      // DOne
      alert('User Created!!')
    })
    .catch((error)=> {
      // Firebase will use this to alert of its errors
      const error_code = error.code
      const error_message = error.message

      alert(error_message)
    });
}

// Set up our login function
function login() {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  full_name = document.getElementById('full_name').value
  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        // save log in details into real time database
        var lgDate = new Date();
        update(ref(database, 'users/' + user.uid), {
          last_login: lgDate,
        })
        .then(() => {
          // Data saved successfully!
          alert('user logged in successfully');
        })
        .catch((error) => {
          // The write failed...
          alert(error);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
}


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
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Aray / forEach
            console.log("GetPlayerData: childkey " + childSnapshot.key);
          });
        } catch (error) {
          console.log("Error getPlayerData" + error);
        }
      }
    });
}//end getPlayerData

// Validate Functions
function validate_email(email) {
  let expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}


function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  }
  else {
    return true
  }
}

