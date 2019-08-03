<template>
  <div class="hello">
    <p>{{msg}}</p>
  </div>
</template>

<script>
import conf from '../config'

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Trying to ping server.'
    }
  },
  created() {
    fetch(`${conf.BASE_URL}/ping`).then(resp => {
      this.msg = 'Successfully pinged server.'
      console.log('Ping response:')
      console.log(resp)
    }).catch(err => {
      console.log(err)
      this.msg = 'Failed to ping server'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
