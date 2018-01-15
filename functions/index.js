const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.fillUserData = functions.auth.user().onCreate(event => {
	admin.database().ref('/users/' + event.data.uid + '/').set({ 
		user: event.data
	});
});
