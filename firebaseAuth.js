// Import the functions you need from the SDKs you nee
// TODO: Add SDKs for Firebase products that you want to use
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js'
import { } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js'

// https://firebase.google.com/docs/web/setup#available-libraries

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

//AUTHENTICATION STUFF
// Initialize Firebase

let signupBtn = document.getElementById("signupBtn");
let signinBtn = document.getElementById("signinBtn");
let title = document.getElementById("title");

function signinButton() {
    nameField.style.maxHeight = "0";
    title.innerHTML = "Sign In";
    signupBtn.classList.add("disable");
    signibnBtn.classList.remove("disable");
}
function signupButton() {
    nameField.style.maxHeight = "60px";
    title.innerHTML = "Sign Up";
    signibnBtn.classList.remove("disable");
    signinBtn.classList.add("disable");
}

function signUp(username, email, password,cfmPassword, hawkerCode) {
   signupButton()
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
    signinButton()
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


  var db = firebase.database().ref();
  // display database
function displayCenters() {

  var centersContainer = document.getElementById('centers-container');
  centersContainer.innerHTML = '';

  db.collection('centers').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var centerData = doc.data();
      var centerId = doc.id;

      var centerElement = document.createElement('div');
      centerElement.className = 'center-item';

      var centerNameElement = document.createElement('h3');
      centerNameElement.textContent = centerData.name;
      centerElement.appendChild(centerNameElement);

      var centerCodeElement = document.createElement('p');
      centerCodeElement.textContent = 'Code: ' + centerData.code;
      centerElement.appendChild(centerCodeElement);

      var centerRegionElement = document.createElement('p');
      centerRegionElement.textContent = 'Region: ' + centerData.region;
      centerElement.appendChild(centerRegionElement);

      // delete
      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
        deleteCenter(centerId);
      });
      centerElement.appendChild(deleteButton);

      centersContainer.appendChild(centerElement);
    });
  });
}

// create new 
function createCenter() {

  var centerName = document.getElementById('center-name').value;
  var centerCode = document.getElementById('center-code').value;
  var stallList = document.getElementById('stall-list').value;
  var stalls = stallList.split(',');

  // add to db
  db.ref('hawker centers/' + centerCode).set({
    'hawker code': centerCode,
    'hawker name': centerName
  })
  .then(function() {
    console.log('Center added');
    var centerRef = db.collection('hawker centers').doc(centerCode);
    var batch = db.batch();
    stalls.forEach(function(stallName) {
      var stallDocRef = centerRef.collection('stalls').doc();
      batch.set(stallDocRef, { name: stallName });
    });
    return batch.commit();
  })
  .then(function() {
    console.log('Stalls added');
    displayCenters();
  })
  .catch(function(error) {
    console.error('Error:', error);
  });
}

// del
function deleteCenter(centerId) {
  db.collection('centers').doc(centerId).delete()
    .then(function() {
      console.log('Center deleted:', centerId);
      displayCenters();
    })
    .catch(function(error) {
      console.error('Error:', error);
    });
}


window.onload = function() {
  if (window.location.pathname == '/admin.html') {
    displayCenters();
    let btnc = document.getElementsByID("addbuttontest");
    btnc.onclick = createCenter();
  }
};


// running the functions
signinBtn.onclick = function(){
  let email1 = document.getElementById("emailLogIn");
  let password1 = document.getElementById("passwordLogIn");
  logIn(email1.value, password1.value);
}
// getting details
