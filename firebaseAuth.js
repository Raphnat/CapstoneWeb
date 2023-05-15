// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuSzs-m6ToSKy5M7RGPT6-whsmajo0iKg",
  authDomain: "soshiok-ip2023.firebaseapp.com",
  projectId: "soshiok-ip2023",
  storageBucket: "soshiok-ip2023.appspot.com",
  messagingSenderId: "431465307758",
  appId: "1:431465307758:web:bb5b2cf610e7facd1a507f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 

function signUp(username, email, password,cfmPassword, hawkerCode) {
    if (password !== cfmPassword) {
        console.error(`Passwords do not match`);
        return;
      } 

      // additional: how to ensure hawker code is legit?
    firebase.auth().createUserWithEmailAndPassword(username, email, password, hawkerCode)
      .then((userCredential) => {
        
        const user = userCredential.user;
        console.log(`${user.uid} signed up successfully ${user.email}`);
  
        // custom claim
        return user.getIdToken().then((idToken) => {
          return fetch('/setCustomClaims', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken: idToken })
          });
        });
      })
      .catch((error) => {
        console.error(`error signing up: ${error.message}`);
      });
  }
  function logIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        
        const user = userCredential.user;
  
        
        user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.type === 'Hawker') {
            console.log(`${user.uid} logged in successfully ${user.email}`);
          } else {
            
            console.error(`Error logging in: User ${user.uid} is not a hawker`);
            firebase.auth().signOut();
          }
        });
      })
      .catch((error) => {
        console.error(`Error loggin in user: ${error.message}`);
      });
  }
function logOut() {
    firebase.auth().signOut()
      .then(() => {
        console.log('logged out successfully');
      })
      .catch((error) => {
        console.error(`Error logging out: ${error.message}`);
      });
}

 // custom claims stuff idk
const functions = firebase.functions();

const setCustomClaims = functions.httpsCallable('setCustomClaims');

setCustomClaims({ type: 'Hawker' })
  .then(() => {
    console.log('cc set successfully');
  })
  .catch((error) => {
    console.error(`Error setting cc: ${error.message}`);
  });