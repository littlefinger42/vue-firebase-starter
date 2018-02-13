<template>
  <v-container fluid fill-height>
    <v-layout row wrap>
        <v-flex xs12>
            <h1 class="headline">Welcome to {{ appName }}</h1>
            <h2 class="title">Useful Links</h2>
            <v-list two-line>
              <template v-for="link in links">
                <v-list-tile v-bind:key="link.title" @click="">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="link.title"></v-list-tile-title>
                    <v-list-tile-sub-title><a :href="link.link">{{link.title}}</a></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      appName: 'Mapapp',
      links: [
        {"title":"wiki", "link":"http://copleybros.co.uk/wiki"},
        {"title":"trello", "link":"https://trello.com/b/d2wX9noF/software-development"}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
