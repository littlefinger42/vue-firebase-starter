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
  store.commit('UPDATE_USER', user)
})
