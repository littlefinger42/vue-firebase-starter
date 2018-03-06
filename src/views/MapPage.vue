<template>
  <v-layout row wrap>
    <v-container fluid fill-height>


      <v-flex xs12>
        <h1 class="title">{{ msg }}</h1>
        <v-alert v-if="partOfGroup === false"color="warning" icon="check_circle" value="true">
          <p>
            You're not part of a group yet. Go to <a href="/settings">settings</a>. <!-- TODO: Fix this link -->
          </p>
        </v-alert>
      </v-flex>

    </v-container>
      <v-flex xs12>

      <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true">
        <vl-view :zoom="mapZoom" :center="mapCentre" :rotation="mapRotation"></vl-view>

        <vl-geoloc @update:position="onUpdatePosition" v-if="tracking">
          <template scope="geoloc">
            <vl-feature v-if="geoloc.position" id="geoloc-feature">
              <vl-geom-point class="hello" :coordinates="geoloc.position"></vl-geom-point>
              <vl-style-box>
                <vl-style-circle>
                  <vl-style-stroke :color="user.data.userData.map_icon_colour"></vl-style-stroke>
                </vl-style-circle>
              </vl-style-box>
            </vl-feature>
          </template>
        </vl-geoloc>

        <vl-feature v-for="groupMember in groupLocations" :key="groupMember.name">
          <vl-geom-point :coordinates="groupMember.location"></vl-geom-point>
            <vl-style-box>
              <vl-style-circle>
                <vl-style-stroke :color="groupData.members[groupMember.name].map_icon_colour"></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
        </vl-feature>

        <vl-layer-image>
          <vl-source-image-static :url="backgroundSrc" :size="backgroundSize" :extent="backgroundExtent"></vl-source-image-static>
        </vl-layer-image>
      </vl-map>
      </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import firebase from 'firebase'
import { db } from '../initFirebase'
import { vlCore, Feature } from 'vuelayers'

const methods = {
  onUpdatePosition (coordinate) {
    this.deviceCoordinate = coordinate
    this.mapCentre = coordinate
    this.writePositionData(coordinate)
  },
  writePositionData (coordinate) {
    if (this.user && this.user.data.groupData.current_group) {
      const userId = this.user.uid
      const groupId = this.user.data.groupData.current_group
      const time = Date.now()

      firebase.database().ref('locations/' + groupId + '/' + userId).set({coordinates: coordinate, time: [time]}).then(function() {
        console.log('Written coordinate data to database: ', coordinate, time)
      })
    } else {
      console.log('No user data')
    }
  },
  recieveGroupData (currentGroup) {
    let self = this

    firebase.database().ref('groups/' + currentGroup).on('value', function(snapshot) { 
      const groupData = snapshot.val()
      console.log('Group Data', groupData)
      self.groupData = groupData
      getLocations()
    })

    function getLocations() {
      firebase.database().ref('locations/' + currentGroup).on("child_changed", function(snapshot) {
        var response = snapshot.val()
        var memberId = snapshot.key
        var memberCoordinates = response.coordinates
        const groupLocations = self.groupLocations
        console.log('Recieved group-user data: ' + memberId, memberCoordinates)
  
        if (!updateMember(memberId, memberCoordinates)) { // If member doesn't exist, create a new one
          self.groupLocations.push({name: memberId, location: memberCoordinates})
        }
      })
  
      function updateMember(memberId, memberCoordinates) {
        var groupLength = self.groupLocations.length
        if (groupLength > 0) {
          for (var i = 0; i < groupLength; i++) {
            if (self.groupLocations[i].name === memberId) {
              self.groupLocations[i].location = memberCoordinates
              return true
            }
          }
          return false
        } else {
          return false
        }
      }
    }

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
      tracking: true,
      groupLocations: [],
      groupData: {},
      backgroundSrc: require('../assets/logo.png'),
      backgroundX: 1024 * 10000,
      backgroundY: 968 * 10000,
      backgroundExtent: [-20000,-20000, 20000, 20000],
      backgroundSize: [1024, 968],
    }
  },
  mounted () {
    if (this.user && this.user.data.groupData.current_group !== '') {
      this.recieveGroupData(this.user.data.groupData.current_group)
    } else {
      this.partOfGroup = false
    }
  }
}
</script>
<style lang="sass">
.vl-map 
  border: 1px solid red;
</style>
