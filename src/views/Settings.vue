<template>
<v-layout row wrap>
  <v-flex xs12>
      <h1 class="title">{{ msg }}</h1>
  </v-flex>

  <v-flex xs12 sm6>
    <v-card>
      <v-card-title primary class="title">Created Group Settings</v-card-title>
      <v-alert v-if="createGroupStatus === 'warning'" color="error" icon="warning" value="true">
        {{createGroupStatusText}}
      </v-alert>
      <v-alert v-if="createGroupStatus === 'success'"color="success" icon="check_circle" value="true">
        {{createGroupStatusText}}
      </v-alert>
      <v-card-text>
        Created group: {{user.data.group.created_group}}
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
    <v-card>
      <v-card-title primary class="title">Join a group</v-card-title>
      <v-alert v-if="joinGroupStatus === 'warning'" color="error" icon="warning" value="true">
        {{joinGroupStatusText}}
      </v-alert>
      <v-alert v-if="joinGroupStatus === 'success'"color="success" icon="check_circle" value="true">
        {{joinGroupStatusText}}
      </v-alert>
      <v-card-text>
        Current group: {{user.data.group.current_group}}
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
      createGroupName: '',
      createGroupStatus: '',
      createGroupStatusText: '',
      joinGroupText: 'Enter group name to join your friends group. Note you can only be part of one group at a time.',
      joinGroupName:'',
      joinGroupStatus: '',
      joinGroupStatusText: ''
    }
  },
  mounted() {
    var database = firebase.database()
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
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
      firebase.database().ref('users/' + userUid + '/group').set({
        created_group: groupId,
        current_group: groupId
      }).then(function(){
        self.createGroupStatus = 'success'
        self.createGroupStatusText = 'Group Created'
        user.data.group.created_group = groupId
        user.data.group.current_group = groupId
        store.commit('UPDATE_USER_GROUP', user.data.group)
      })
    }

    },
    joinGroup: function(groupId) {
      let self = this;
      const user = this.user
      const userUid = user.uid

      firebase.database().ref('groups/' + groupId).once('value').then(function(snapshot) {
        if (snapshot.val() === null) {
          self.joinGroupStatus = 'warning'
          self.joinGroupStatusText = 'This group doesnt exist.'
        } else {
          doJoinGroup()
        }
      })

      function doJoinGroup() {
        firebase.database().ref('users/' + userUid + '/group/').update({
          current_group: groupId
        }).then(function() {
          self.joinGroupStatus = 'success'
          self.joinGroupStatusText = 'Group Joined'
          user.data.group.current_group = groupId
          store.commit('UPDATE_USER_GROUP', user.data.group)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
