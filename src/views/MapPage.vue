<template>
  <v-layout row wrap>

    <v-flex xs12>
        <h1 class="title">{{ msg }}</h1>
    </v-flex>

    <v-flex xs12>

      <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true">
        <vl-view :zoom="2" :center="[0, 0]" :rotation="0"></vl-view>

        <vl-geoloc>
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
export default {
  name: 'MapPage',
  data () {
    return {
      msg: 'Map Page'
    }
  }
}
</script>
<style lang="sass">
.map 
  height: 400px;
  width: 100%;

</style>
