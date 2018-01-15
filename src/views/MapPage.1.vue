<template>
  <div class="mapPage">
    <h1>Map</h1>
    <div id="map" class="map"></div>
    <router-link to="/">back to home</router-link>
  </div>
</template>
<script>
import ol from 'ol'

export default {
  name: 'MapPage',
  data () {
    return {
      msg: 'null value'
    }
  },
  mounted () {
    this.$nextTick(function () {
      initMap()
    })
  }
}

  

  function initMap () {
    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
      })
    })
    console.log(map)
  }
</script>
<style lang="sass">
.map 
  height: 400px;
  width: 100%;

</style>
