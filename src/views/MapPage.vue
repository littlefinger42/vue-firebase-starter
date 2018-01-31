<template>
  <v-layout row wrap>

    <h1 class="title">{{ msg }}</h1>

    <v-flex xs12>
      <v-alert v-if="partOfGroup === false"color="warning" icon="check_circle" value="true">
        <p>
          You're not part of a group yet. Go to <a href="/settings">settings</a>. <!-- TODO: Fix this link -->
        </p>
      </v-alert>
      <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true">
        <vl-view :zoom="mapZoom" :center="mapCentre" :rotation="mapRotation"></vl-view>

        <vl-geoloc @update:position="onUpdatePosition">
          <template scope="geoloc">
            <vl-feature v-if="geoloc.position" id="geoloc-feature">
              <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
            </vl-feature>
          </template>
        </vl-geoloc>

          <vl-feature v-for="groupMember in groupLocations">
            <vl-geom-point :coordinates="groupMember.location"></vl-geom-point>
          </vl-feature>

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
      firebase.database().ref('users/' + userId + '/location/').update({ [time]: {coordinates: coordinate}}).then(function() {
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
   firebase.database().ref('groups/' + currentGroup + '/members/').once('value').then(function(snapshot) {
      const memberList = snapshot.val()
      for(var i = 0; i<memberList.length;i++) {
        firebase.database().ref('users/' + memberId + '/location/').on("child_added", function(snapshot) {
          console.log(snapshot.val())
          console.log('hey')
        })
      }
   })
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
      partOfGroup: true,
      mapZoom: 8,
      mapCentre: [0, 0],
      mapRotation: 0,
      groupLocations: [
        { name: 'Jean', location: ['5.48', '51.43']}, 
        { name: 'Laurie', location: ['5.58', '50.43']}, 
        { name: 'Taisei', location: ['6.48', '52.43']}, 
        { name: 'Louis', location: ['5.48', '51.73']}, 
        { name: 'Bonnaire', location: ['5.90', '51.43']}
      ]
    }
  },
  mounted () {
    if (this.user.data.groupData.current_group !== '') {
      this.recieveGroupData(this.user.data.groupData.current_group)
    } else {
      this.partOfGroup = false
    }
  }
}
</script>
<style lang="sass">
.map 
  height: auto;
  width: 100%;
</style>
