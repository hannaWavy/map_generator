<script setup lang="ts">
import MapForm from '../components/map/MapForm.vue'
import MapCanvas from '../components/map/MapCanvas.vue'
</script>

<template>
  <main>
    <MapForm />
    <MapCanvas :width="260" :height="150" />
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: space-between;
}
</style>
