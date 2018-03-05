/* This is the entry point */

// polyfills
import 'es6-promise/auto'
import 'weakmap' // for vuexfire, using (imports-loader)

import Vue from 'vue'
import Vuetify from 'vuetify' 
import App from './App'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'

// Enable progressive web app support (with offline-plugin)
if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

// vuetify
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)

// firebase
import './initFirebase'

// vuelayers
import {Map, Feature, PointGeom, OsmSource, Geoloc, TileLayer, StyleBox, StrokeStyle} from 'vuelayers'
import 'vuelayers/lib/style.css'
Vue.use(Map)
Vue.use(Feature)
Vue.use(PointGeom)
Vue.use(OsmSource)
Vue.use(TileLayer)
Vue.use(Geoloc)
Vue.use(StyleBox)
Vue.use(StrokeStyle)

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
