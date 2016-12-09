(() => {
    // Give the service worker access to Firebase Messaging.
    // Note that you can only use Firebase Messaging here, other Firebase libraries
    // are not available in the service worker.
    importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

    // Initialize the Firebase app in the service worker by passing in the
    // messagingSenderId.
    firebase.initializeApp({
        'messagingSenderId': '57993743357'
    });

    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    const messaging = firebase.messaging();
    // messaging.useServiceWorker(self.registration());

    messaging.setBackgroundMessageHandler(function(payload) {
        const title = 'Hello World';
        const options ={
            body: payload.data.status
        };
        return self.registration.showNotification(title, options);
    });
});