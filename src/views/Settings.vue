<template>
<v-layout row wrap>
  <v-flex xs12>
      <h1 class="title">{{ msg }}</h1>
  </v-flex>
  <v-flex xs6>
    <v-card>
      <v-card-title primary class="title">Create a group</v-card-title>
      <v-card-text
        v-text="createGroupText">
      </v-card-text>
      <v-card-actions>
        <v-text-field name="Create Group Input" label="Group Name" id="createGroupInput" v-model="createGroupName"></v-text-field>
        <v-btn flat color="primary" id="createGroupBtn" v-on:click="writeGroupData(createGroupName, 'test')">Create</v-btn>
      </v-card-actions>

    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
import firebase from 'firebase'
import { db } from '../initFirebase'
import { mapState } from 'vuex'

export default {
  name: 'settingsPage',
  mounted() {
    var database = firebase.database()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    writeGroupData: function(groupId) {
      const user = this.user.uid
      firebase.database().ref('groups/' + groupId).set({
        open: true,
        members: {
          user
        }
      })
      firebase.database().ref('users/' + user).set({
        created_group: groupId,
        current_group: groupId
      })
      // console.log(user)
    }
  },
  data () {
    return {
      msg: 'Settings Page',
      createGroupText: 'You can only have one group at a time. Creating a new group will discard your last created one.',
      createGroupName: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
