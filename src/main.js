/* This is the entry point */

// polyfills
import 'es6-promise/auto'
import 'weakmap' // for vuexfire, using (imports-loader)

import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'

// Enable progressive web app support (with offline-plugin)
if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

// vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)

// firebase
import './initFirebase'

// openlayers
import VueLayers from 'vuelayers'
// import VueLayers styles, needs css-loader
import 'vuelayers/lib/style.css'
// register all vl-* components
Vue.use(VueLayers)

Vue.config.productionTip = false

// Sync the router with the vuex store. This registers `store.state.route`
sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
