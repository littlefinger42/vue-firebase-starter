<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed v-model="drawer" app>
      <v-list dense>
        <v-list-tile @click="" to="/">
          <v-list-tile-action><v-icon>home</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Home</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="" to="map">
          <v-list-tile-action><v-icon>map</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Map</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="" v-show="user" to="settings">
          <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Settings</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="" v-show="!user" to="login">
          <v-list-tile-action><v-icon>person</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Login</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="" v-show="user" to="profile" ref="userButton">
          <v-list-tile-action><v-icon>person</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Profile</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="" v-show="user" to="logout">
          <v-list-tile-action><v-icon>time_to_leave</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Logout</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
          <router-view></router-view>
      </v-container>
    </v-content>
    
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  </v-app>  
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    drawer: null
  }),
  computed: {
    ...mapState({
      user: 'user'
    })
  },
  watch: {
    user (val) {
      if (val) {
        this.userMenuTrigger = this.$refs.userButton.$el
      }
    }
  }
}
</script>

<style lang="sass">
#app
</style>
<style scoped>
.content {
  width: 90%;
  margin: 0 auto;
}

.body {
  background-color: white;
  border-radius: 5px;
  min-height: 500px;
}
</style>
