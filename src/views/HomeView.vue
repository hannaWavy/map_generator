<script setup lang="ts">
import MapForm from '../components/map/MapForm.vue'
import MapCanvas from '../components/map/MapCanvas.vue'
</script>

<template>
  <main>
    <MapForm />
    <MapCanvas />
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: space-between;
}
</style>