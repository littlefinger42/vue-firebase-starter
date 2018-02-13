<template>
<v-container fluid fill-height>
<v-layout row wrap>
    <v-flex xs12>
        <h1 class="title">{{ msg }}</h1>
    </v-flex>

    <v-flex xs12>
      <v-card class="mx-1">
        <v-card-title primary class="title">User Settings</v-card-title>
        <v-alert v-if="userSettingsStatus === 'success'"color="success" icon="check_circle" value="true">
          {{userSettingsStatusText}}
        </v-alert>
        <v-card-text>
          Here you can control settings specific to your user account.
        </v-card-text>
        <v-card-actions>
          <v-text-field name="Map Icon Colour (#HEX)" label="Map Icon Colour (#HEX)" id="mapIconColour" v-model="mapIconColour"></v-text-field>
          <v-btn flat color="primary" id="mapIconColourBtn" v-on:click="setMapIconColour(mapIconColour, '#fff')">Set</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-flex xs12 sm6>
      <v-card class="mx-1">
        <v-card-title primary class="title">Created Group Settings</v-card-title>
        <v-alert v-if="createGroupStatus === 'warning'" color="error" icon="warning" value="true">
          {{createGroupStatusText}}
        </v-alert>
        <v-alert v-if="createGroupStatus === 'success'"color="success" icon="check_circle" value="true">
          {{createGroupStatusText}}
        </v-alert>
        <v-card-text>
          Created group: {{user.data.groupData.created_group}}
        </v-card-text>
        <v-card-text
          v-text="createGroupText">
        </v-card-text>
        <v-card-actions>
          <v-text-field name="Create Group Input" label="Group Name" id="createGroupInput" v-model="createGroupName"></v-text-field>
          <v-btn flat color="primary" id="createGroupBtn" v-on:click="createGroup(createGroupName, 'test')">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-flex xs12 sm6>
      <v-card class="mx-1">
        <v-card-title primary class="title">Join a group</v-card-title>
        <v-alert v-if="joinGroupStatus === 'warning'" color="error" icon="warning" value="true">
          {{joinGroupStatusText}}
        </v-alert>
        <v-alert v-if="joinGroupStatus === 'success'"color="success" icon="check_circle" value="true">
          {{joinGroupStatusText}}
        </v-alert>
        <v-alert v-if="joinGroupStatus === 'info'"color="info" icon="info" value="true">
          {{joinGroupStatusText}}
        </v-alert>
        <v-card-text>
          Current group: {{user.data.groupData.current_group}}
        </v-card-text>
        <v-card-text
          v-text="joinGroupText">
        </v-card-text>
        <v-card-actions>
          <v-text-field name="Join Group Input" label="Group Name" id="joinGroupInput" v-model="joinGroupName"></v-text-field>
          <v-btn flat color="primary" id="joinGroupBtn" v-on:click="joinGroup(joinGroupName, 'test')">Join</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
</v-layout>
</v-container>
</template>

<script>
import firebase from 'firebase'
import { db } from '../initFirebase'
import { mapState } from 'vuex'
import store from '../store'

export default {
  name: 'settingsPage',
  data () {
    return {
      msg: 'Settings Page',
      createGroupText: 'You can only have one group at a time. Creating a new group will discard your last created one.',
      createGroupName: undefined,
      createGroupStatus: undefined,
      createGroupStatusText: undefined,
      joinGroupText: 'Enter group name to join your friends group. Note you can only be part of one group at a time.',
      joinGroupName: undefined,
      joinGroupStatus: undefined,
      joinGroupStatusText: undefined,
      mapIconColour: undefined,
      userSettingsStatus: undefined,
      userSettingsStatusText: undefined
    }
  },
  mounted() {
    var database = firebase.database()
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    setMapIconColour: function(mapIconColour) {
      let self = this;
      let user = this.user
      const userUid = user.uid

      firebase.database().ref('users/' + userUid + '/user/userData/').update({
        "map_icon_colour": mapIconColour
      }).then(function() {
          self.userSettingsStatus = 'success'
          self.userSettingsStatusText = 'Map icon colour set to ' + mapIconColour
      })
    },
    createGroup: function(groupId) {
      let self = this;
      let user = this.user
      const userUid = user.uid

      firebase.database().ref('groups/' + groupId).once('value').then(function(snapshot) {
        if (snapshot.val() !== null) {
          self.createGroupStatus = 'warning'
          self.createGroupStatusText = 'A group with the same name already exists.'
        } else {
          doCreateGroup()
        }
      })

    function doCreateGroup() {
      firebase.database().ref('users/' + userUid + '/user/groupData/').set({
        created_group: groupId,
        current_group: groupId
      }).then(function(){
        self.createGroupStatus = 'success'
        self.createGroupStatusText = 'Group Created'
        user.data.groupData.created_group = groupId
        user.data.groupData.current_group = groupId
        store.commit('UPDATE_USER_GROUP', user.data.groupData)
      })
    }

    },
    joinGroup: function(groupId) {
      let self = this;
      const user = this.user
      const userUid = user.uid

      if (groupId !== user.data.groupData.current_group) {
        firebase.database().ref('groups/' + groupId).once('value').then(function(snapshot) {
          if (snapshot.val() === null) {
            self.joinGroupStatus = 'warning'
            self.joinGroupStatusText = 'This group doesnt exist.'
          } else {
            doJoinGroup()
          }
        })
      } else {
        self.joinGroupStatus = 'info'
        self.joinGroupStatusText = 'You are already a member of this group'
      }
      
      function doJoinGroup() {
        firebase.database().ref('users/' + userUid + '/user/groupData/').update({
          current_group: groupId
        }).then(function() {
          self.joinGroupStatus = 'success'
          self.joinGroupStatusText = 'Group Joined'
          user.data.groupData.current_group = groupId
          store.commit('UPDATE_USER_GROUP', user.data.groupData)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
