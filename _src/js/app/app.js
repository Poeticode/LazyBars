import createHistory from 'history/createBrowserHistory';
// import localforage from 'localforage';
(function() {
    // localforage.setDriver(localforage.INDEXEDDB);
    var firebase = require('firebase/app');
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
    var notification = document.querySelector('.mdl-js-snackbar');
    require('./modules/service-worker-registration.js')(notification, messaging);

    messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');
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