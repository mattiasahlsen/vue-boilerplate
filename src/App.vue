<template>
  <div id="app">
    <HelloWorld/>
  </div>
</template>

<script>
import styles from './styles/imports.scss'

import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  font-family: 'Montserrat', sans-serif;
}
</style>
