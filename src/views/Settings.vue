<template>
  <div class="settings">
    <h1>{{ msg }}</h1>
	<mu-text-field label="Group Name" labelFloat/><br/>
	<mu-text-field label="Group Name" labelFloat/><br/>
	<div class="demo-grid">
		<mu-row gutter>
			<mu-col width="100" tablet="50" desktop="50">col-100<br/>tablet-50<br/>desktop-33</mu-col>
			<mu-col width="100" tablet="50" desktop="50">col-100<br/>tablet-50<br/>desktop-33</mu-col>
		</mu-row>
	</div>
  </div>
</template>

<script>
export default {
  name: 'settingsPage',
  data () {
    return {
      msg: 'Settings Page'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
