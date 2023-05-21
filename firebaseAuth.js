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

//AUTHENTICATION STUFF
// Initialize Firebase
const app = initializeApp(firebaseConfig); 

function signUp(username, email, password,cfmPassword, hawkerCode) {
    if (password !== cfmPassword) {
        console.error(`Passwords do not match`);
        return;
      } 

      // additional: how to ensure hawker code is legit?
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(`${user.uid} signed up successfully ${user.email}`);
  
        // Set custom claim 
        const customClaims = {
          hawkerCode: hawkerCode,
          type: "Hawker"
        };
  
        return user.getIdToken()
          .then((idToken) => {
            return fetch('/setCustomClaims', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ idToken: idToken, customClaims: customClaims })
            });
          })
          .then(() => {
            console.log("Custom claim set successfully!");
          })
          .catch((error) => {
            console.error("Error setting custom claim: " + error);
          });
      })
      .catch((error) => {
        console.error(`Error signing up: ${error.message}`);
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

  //DATABASE STUFF
  //MENU PART
  function menuAccess(centerName, stallName) {

    var menuRef = firebase.database().ref(centerName + '/'+ stallName + '/menu');
  

    menuRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var itemKey = childSnapshot.key;
        var itemData = childSnapshot.val();

        console.log("Item key: " + itemKey);
        console.log("Item name: " + itemData.name);
        console.log("Item price: " + itemData.price);

      });
    });
  }

  function addItem(centerName, stallName, itemName, itemPrice) {
    var menuRef = firebase.database().ref(centerName + '/'+ stallName + '/menu');
    
    var newItemRef = menuRef.push();
    newItemRef.set({
      name: itemName,
      price: itemPrice
    })
      .then(function() {
        console.log("Item added");
      })
      .catch(function(error) {
        console.error("Error adding item: " + error);
      });
  }

  function deleteItem(centerName, stallName, itemName) {
    var menuRef = firebase.database().ref(centerName + '/'+ stallName + '/menu');
  
    menuRef.orderByChild('name').equalTo(itemName).once('value', function(snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach(function(childSnapshot) {
          var itemKey = childSnapshot.key;
          var itemRef = catalogRef.child(itemKey);
          itemRef.remove()
            .then(function() {

              console.log("Item deleted:"+ itemName);

            })
            .catch(function(error) {
              console.error("Error deleting item " + error);
            });
        });
      } else {
        console.log(itemName + "does not exist");
      }
    });
  }
  function updatePrice(centerName, stallName, itemName, newItemPrice) {
    var menuRef = firebase.database().ref(centerName + '/' + stallName + '/menu');
  
    menuRef.orderByChild('name').equalTo(itemName).once('value', function(snapshot) {
      if (snapshot.exists()) {
        snapshot.forEach(function(childSnapshot) {
          var itemKey = childSnapshot.key;
          catalogRef.child(itemKey).update({ price: newItemPrice })
            .then(function() {

              console.log("Updated item: " + itemName);
              console.log("New price: " + newItemPrice);

            })
            .catch(function(error) {
              console.error("Error updating price: " + error);
            });
        });
      } else {
        console.log(itemName + "does not exist");
      }
    });
  }