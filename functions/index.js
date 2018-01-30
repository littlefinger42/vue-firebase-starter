const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
admin.initializeApp(functions.config().firebase);

exports.fillUserData = functions.auth.user().onCreate(event => {
	const groupData = {
		created_group: '',
		current_group: ''
	}
	let userData = event.data
	// userData.map_icon_colour = '#ff0000'
	admin.database().ref('/users/' + event.data.uid + '/').set({
		user: {userData, groupData},
	});
});

exports.createJoinGroup = functions.database.ref('/users/{userID}/user/groupData/').onUpdate(event => {
	const eventSnapshot = event.data
	const userId = event.params.userID
	if (eventSnapshot.changed()) {
		const groupData = eventSnapshot.val()
		const groupDataOld = eventSnapshot.previous.val()

		if (groupData.created_group !== groupDataOld.created_group) { // If the a new group has been created.
			doCreateGroup(groupDataOld.created_group, groupData.created_group, userId)
		} else if (groupData.current_group !== groupDataOld.current_group) { // If a group has been joined
			doJoinGroup(groupDataOld.current_group, groupData.current_group, userId)
		}
	}

	function doCreateGroup(groupIdOld, groupId, userId) {
		admin.database().ref('groups/' + groupIdOld).remove().then(function(){
			admin.database().ref('groups/' + groupId + '/').set({ open: true, members: { [userId]: true } }).then(function(){
				console.log(userId + ' created group ' + groupId)
			})
		})
	}
	function doJoinGroup(groupIdOld, groupId, userId) {
		admin.database().ref('groups/' + groupIdOld + '/members/' + userId).remove().then(function() {
			admin.database().ref('groups/' + groupId + '/members/').update({ [userId]: true }).then(function(){
				console.log(userId + ' joined group ' + groupId)
			})
		})
	}
});

//===== Endpoints

exports.groupmembers = functions.https.onRequest((req, res) => {
		if (req.method === 'PUT') {
			res.status(403).send('Forbidden!');
		}

		cors(req, res, () => {
			if (req.query.groupId) {
				const groupId = req.query.groupId
				const userId = req.query.userId

				admin.database().ref('groups/' + groupId + '/members/').once('value').then(function(snapshot) {
					const memberList = snapshot.val()
					console.log(memberList)
					let memberLocations = []
					var promises = []
						
					for (var member in memberList) {
						const memberId = member

						if (userId !== member && memberList.hasOwnProperty(memberId)) {
							try { 
								let promise = admin.database().ref('users/' + memberId + '/location/').limitToLast(1).once('value').then(function(snapshot) {
									let location = snapshot.val()
									location.userId = memberId
									memberLocations.push(location)
								})
								promises.push(promise);
							} catch(error) {
								console.log(error)
							}
						}
					}

					Promise.all(promises).then(function() {
						res.status(200).send(memberLocations)
					})
				})
			} else {
				res.status(403).send('Bad Request: Please attach groupId as a query parameter.');
			}
		})
	})