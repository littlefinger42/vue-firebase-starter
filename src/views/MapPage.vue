<template>
  <v-layout row wrap>

    <v-flex xs12>
        <h1 class="title">{{ msg }}</h1>
    </v-flex>

    <v-flex xs12>

      <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true">
        <vl-view :zoom="mapZoom" :center="mapCentre" :rotation="mapRotation"></vl-view>

        <vl-geoloc @update:position="onUpdatePosition">
          <template scope="ctx">
            <vl-feature v-if="ctx.position" id="geoloc-feature">
              <vl-geom-point :coordinates="ctx.position"></vl-geom-point>
            </vl-feature>
          </template>
        </vl-geoloc>

        <vl-layer-tile id="osm">
          <vl-source-osm></vl-source-osm>
        </vl-layer-tile>
      </vl-map>

    </v-flex>

  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import firebase from 'firebase'
import { db } from '../initFirebase'

const methods = {
  onUpdatePosition (coordinate) {
    this.deviceCoordinate = coordinate
    this.mapCentre = coordinate
    this.writePositionData(coordinate)
  },
  writePositionData (coordinate) {
    if (this.user) {
      const userId = this.user.uid
      console.log('userid from map page', userId)
      const time = Date.now();
      firebase.database().ref('users/' + userId + '/location/').push({ coordinates: coordinate, time: time }).then(function() {
        console.log('Written coordinate data to database: ', coordinate, time)
      })
    } else {
      console.log('No user data')
    }
  },
  recievePositionData (theirUserId) {
    firebase.database().ref('users/' + theirUserId + '/location/').limitToLast(1).on('value', function(snapshot) {
      const recievedPositionData = snapshot.val()
      console.log(recievedPositionData)
    })
  },
  recieveGroupData (currentGroup) {
    // Make call to cloud function which returns array of group position data
  }
}


export default {
  name: 'MapPage',
  methods,
  computed: {
    ...mapState(['user']),
  },
  data () {
    return {
      msg: 'Map Page',
      deviceCoordinate: undefined,
      mapZoom: 8,
      mapCentre: [0, 0],
      mapRotation: 0
    }
  },
  watch: {
    user (val) {
      if (val.groupData.current_group !== "") {
        this.recieveGroupData(val.groupData.current_group)
      }
    }
  }
}
</script>
<style lang="sass">
.map 
  height: 400px;
  width: 100%;

</style>
