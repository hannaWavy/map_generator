<template>
  <canvas id="mapCanvas" ref="mapCanvas" :width="width" :height="height" :class=$options.className />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { HEIGHT_COLORS } from './MapStyle';
import { useMapStore } from '../../stores/map';

export default defineComponent({
  name: 'MapCanvas',
  className: 'MapCanvas',
  props: {
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 100,
    },
  },
  setup(props) {
    const maxHeight = 8000;
    const minHeight = -8000;

    const mapCanvas: Ref<HTMLCanvasElement | undefined> = ref();
    const context: Ref<CanvasRenderingContext2D | undefined> = ref();

    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    }

    function render() {
      if (!context.value) {
        return;
      }
      const mapStore = useMapStore();

      const dispersion: number = HEIGHT_COLORS.length,
        range: number = maxHeight - minHeight,
        step: number = range / dispersion;

      let color = HEIGHT_COLORS[0],
        height = 0;

      mapStore.setSize(props);

      for (let x = 0; x < props.width; x++) {
        for (let y = 0; y < props.height; y++) {
          height = getRandomInt(minHeight, maxHeight);
          color = HEIGHT_COLORS[Math.floor((height - minHeight) / step)];
          mapStore.addPoint({ height, color });

          context.value.fillStyle = '#' + color.toString(16);
          context.value.fillRect(x, y, 1, 1);
        }
      }
    }

    onMounted(() => {
      context.value = mapCanvas.value?.getContext('2d') || undefined;
      render();
    });

    return {
      mapCanvas,
      useMapStore
    };
  },
});
</script>

<style scoped>
.MapCanvas {
  border: 1px solid var(--vt-c-divider-light-1);
  margin-left: 40px;
}
</style>