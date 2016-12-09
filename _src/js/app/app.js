import createHistory from 'history/createBrowserHistory';
import localforage from 'localforage';
(function() {
    // localforage.setDriver(localforage.INDEXEDDB);
    var firebase = require('firebase/app');
    require('firebase/auth');
    require('firebase/database');
    require('firebase/messaging');

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDbFR2vicwdw_dS1kq6XDa3HdmOqoPONbk",
        authDomain: "poeticodes.firebaseapp.com",
        databaseURL: "https://poeticodes.firebaseio.com",
        storageBucket: "poeticodes.appspot.com",
        messagingSenderId: "57993743357"
    };
    firebase.initializeApp(config);
    const messaging = firebase.messaging();
    const tokenDivId = 'token_div';
    const permissionDivId = 'permission_div';


    
    var notification = document.querySelector('.mdl-js-snackbar');
    // require('./modules/service-worker-registration.js')(notification, messaging);


// [START refresh_token]
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function() {
    messaging.getToken()
    .then(function(refreshedToken) {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
      // [START_EXCLUDE]
      // Display new Instance ID token and clear UI of all previous messages.
      resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
      showToken('Unable to retrieve refreshed token ', err);
    });
  });
  // [END refresh_token]
  // [START receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a sevice worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    appendMessage(payload);
    // [END_EXCLUDE]
  });
  // [END receive_message]
  function resetUI() {
    clearMessages();
    showToken('loading...');
    // [START get_token]
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken()
    .then(function(currentToken) {
      if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
      setTokenSentToServer(false);
    });
  }
  // [END get_token]
  function showToken(currentToken) {
    // Show token in console and UI.
    var tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
  }
  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }
  function isTokenSentToServer() {
    if (window.localStorage.getItem('sentToServer') == 1) {
          return true;
    }
    return false;
  }
  function setTokenSentToServer(sent) {
    if (sent) {
      window.localStorage.setItem('sentToServer', 1);
    } else {
      window.localStorage.setItem('sentToServer', 0);
    }
  }
  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = "display: visible";
    } else {
      div.style = "display: none";
    }
  }
  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    // [END request_permission]
  }
  function deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken()
    .then(function(currentToken) {
      messaging.deleteToken(currentToken)
      .then(function() {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      })
      .catch(function(err) {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    })
    .catch(function(err) {
      console.log('Error retrieving Instance ID token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
    });
  }
  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderELement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;'
    dataHeaderELement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderELement);
    messagesElement.appendChild(dataElement);
  }
  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }
  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }
  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }
  $('#permission-button').bind('click', requestPermission);
  $('#delete-token-button').bind('click', deleteToken);
  resetUI();

/*
    messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');

            localforage.setItem(currentToken);
            $('#js-push-toggle')
            updateUIForPushEnabled(currentToken);

            // document.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
            //     message: 'Sweet, thanks for letting me send Push notifications!'
            // });
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            // ...
            return messaging.getToken();
        }).then(function(currentToken) {
            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            if (currentToken) {
                //sendTokenToServer(currentToken);
                //updateUIForPushEnabled(currentToken);
                console.log('got the token!');
                console.log(currentToken);
            } else {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');
                // Show permission UI.
                // updateUIForPushPermissionRequired();
                // setTokenSentToServer(false);
            }
        })
        .catch(function(err) {
            console.log('An error occurred while retrieving token. ', err);
            // showToken('Error retrieving Instance ID token. ', err);
            // setTokenSentToServer(false);
        });

        // .catch(function(err) {
        //     console.log('Unable to get permission to notify.', err);
        //     // document.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
        //     //     message: 'Biscuits, seems that I can\'t send Push notifications!'
        //     // });
        // });


        
    
    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(function() {
        messaging.getToken()
        .then(function(refreshedToken) {
            console.log('Token refreshed.');
            console.log(refreshedToken);
            // Indicate that the new Instance ID token has not yet been sent to the
            // app server.
            // setTokenSentToServer(false);
            // Send Instance ID token to app server.
            // sendTokenToServer(refreshedToken);
            // 
        })
        .catch(function(err) {
            console.log('Unable to retrieve refreshed token ', err);
            // showToken('Unable to retrieve refreshed token ', err);
            // document.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
            //     message: 'Error with retrieving your refreshed token.'
            // });
        });
    });

    messaging.onMessage(function(payload) {
        console.log('onMessage. ',payload);
        // document.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
        //     message: payload
        // });
    });
*/
    

    const history = createHistory();
    const location = history.location;
    const unlisten = history.listen((location, action) => {
        
        if (action === "POP") {
            require('./modules/goto.js')(history, location.pathname, 'body');
        }  
    });

    require("./modules/linkreplacer.js")(history);
    require("./modules/initializer.js")();

})();  