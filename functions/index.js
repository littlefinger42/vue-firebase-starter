const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.fillUserData = functions.auth.user().onCreate(event => {
	const groupData = {
		created_group: '',
		current_group: ''
	}
	admin.database().ref('/users/' + event.data.uid + '/').set({
		user: event.data,
		group: groupData
	});
});

exports.createGroup = functions.database.ref('/users/{userID}/group/created_group')
  .onUpdate(event => {
	const eventSnapshot = event.data
	const userId = event.params.userID
	if (eventSnapshot.changed()) {
		const groupId = eventSnapshot.val()
		const groupIdOld = eventSnapshot.previous.val()
		admin.database().ref('groups/' + groupIdOld).remove()
	}
  });

exports.joinGroup = functions.database.ref('/users/{userID}/group/current_group')
  .onUpdate(event => {
	const eventSnapshot = event.data
	const userId = event.params.userID
	if (eventSnapshot.changed()) {
		const groupId = eventSnapshot.val()
		const groupIdOld = eventSnapshot.previous.val()
		admin.database().ref('groups/' + groupId + '/members/').push({ userId })
		// TODO: Delete user from group
	}
  })