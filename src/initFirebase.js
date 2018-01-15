import firebase from 'firebase'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import store from './store'

firebase.initializeApp({
  apiKey: 'AIzaSyDymAeoPR25POfRMeGcUGYesrG66PBJl9o',
  authDomain: 'testmap-49b0a.firebaseapp.com',
  databaseURL: 'https://testmap-49b0a.firebaseio.com',
  projectId: 'testmap-49b0a',
  storageBucket: 'testmap-49b0a.appspot.com',
  messagingSenderId: '265856802318'
})

if (__DEV__) {
  window.firebase = firebase
}

export const ui = new firebaseui.auth.AuthUI(firebase.auth())

/**
 * Sync store.state.user with firebase.auth().currentUser
 *
 * This callback is called when firebase.auth() detects user changes,
 * so just update the vuex store with the new user object.
 */
firebase.auth().onAuthStateChanged(user => {
  if (user) { // If the user is logged on
    let fullUserData = user;
  
    // Connect to the database to grab more user data if available
    firebase.database().ref('users/' + user.uid + '/').once('value').then(function(snapshot) {
      const userData = snapshot.val()
  
      if (userData !== null) {
        fullUserData.data = userData
        console.log('User Data: ', userData)
        store.commit('UPDATE_USER', fullUserData)
      } else {
        console.log('No user data found on the database')
        store.commit('UPDATE_USER', user)
      }
    })
  } else { // If the user is logged out
    store.commit('UPDATE_USER', user) // Clear the store variable
  }
})
