<template>
  Points amount: {{ clashPointsAmount }}
  <canvas
    id="mapCanvas"
    ref="mapCanvas"
    :width="width"
    :height="height"
    :class="$options.className"
  />
</template>

<script lang="ts">
type Coords = [number, number]
type ClashPoints = [Coords, number]

import type { Ref } from 'vue'
import { defineComponent, onMounted, ref } from 'vue'
import { MapColorScheme } from './MapStyle'
import { useMapStore } from '@/stores/map'
import { getRandomInt } from '@/utils'

export default defineComponent({
  name: 'MapCanvas',
  className: 'MapCanvas',
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    }
  },
  setup(props) {
    const maxHeight = 4000,
      minHeight = -4000,
      clashPointsAmount = Math.round((props.width * props.height) / 4000),
      clashPoints: Map<Coords, number> = new Map()

    const mapCanvas: Ref<HTMLCanvasElement | undefined> = ref(),
      context: Ref<CanvasRenderingContext2D | undefined> = ref()

    function render() {
      if (!context.value) {
        return
      }
      const mapStore = useMapStore()
      const colorScheme = new MapColorScheme({
        minHeight,
        maxHeight
      })

      const drawPoint = function (position: Coords, color: number) {
        if (!context.value) return
        context.value.fillStyle = '#' + color.toString(16)
        context.value.fillRect(position[0], position[1], 1, 1)
      }

      const drawLine = function (startPosition: Coords, endPosition: Coords) {
        if (!context.value) return
        context.value.beginPath()
        context.value.moveTo(...startPosition)
        context.value.lineTo(...endPosition)
        context.value.stroke()
      }

      const calcDistance = function (coordsStart: Coords, coordsEnd: Coords) {
        return Math.sqrt(
          Math.pow(coordsEnd[0] - coordsStart[0], 2) + Math.pow(coordsEnd[1] - coordsStart[1], 2)
        )
      }

      let color = colorScheme.colorHeight(),
        height = 0

      mapStore.setSize(props)

      for (let x = 0; x < props.width; x++) {
        for (let y = 0; y < props.height; y++) {
          //height = getRandomInt(minHeight, maxHeight);
          height = getRandomInt(-500, 0)
          color = colorScheme.colorHeight(height)
          mapStore.addPoint({ height, color })

          drawPoint([x, y], color)
        }
      }

      //lines
      const CONNECTION_AMOUNT = 2

      function addClashPoint(coords: Coords) {
        clashPoints.set(coords, 0)
        mapStore.updatePoint(coords, {
          height: maxHeight,
          color: colorScheme.colorHeight(maxHeight)
        })
        // drawPoint(coords, colorScheme.colorHeight(maxHeight));
      }

      for (let c = 0; c < clashPointsAmount; c++) {
        addClashPoint([getRandomInt(0, props.width), getRandomInt(0, props.height)])

        if (c % 5 === 0) {
          addClashPoint([0, getRandomInt(0, props.height)])
          addClashPoint([getRandomInt(0, props.width), 0])
          addClashPoint([props.width, getRandomInt(0, props.height)])
          addClashPoint([getRandomInt(0, props.width), props.height])
        }
      }

      function borderLine(startCoord: Coords, endCoord: Coords) {
        return (
          (startCoord[0] === 0 && endCoord[0] === 0) ||
          (startCoord[1] === 0 && endCoord[1] === 0) ||
          (startCoord[0] === props.width && endCoord[0] === props.width) ||
          (startCoord[1] === props.height && endCoord[1] === props.height)
        )
      }

      clashPoints.forEach((startPointConnections, startPointCoord, map) => {
        let sortedClashPoints: ClashPoints[] = Array.from(clashPoints.entries()).filter(
          (point) => point[1] < CONNECTION_AMOUNT
        )
        if (startPointConnections < CONNECTION_AMOUNT) {
          sortedClashPoints = sortedClashPoints
            .sort(function compareDistance(a, b) {
              const aDistance = borderLine(startPointCoord, a[0])
                ? 0
                : calcDistance(startPointCoord, a[0])
              const bDistance = borderLine(startPointCoord, b[0])
                ? 0
                : calcDistance(startPointCoord, b[0])
              a[1] = aDistance //instead of connections store distance
              b[1] = bDistance

              return aDistance - bDistance
            })
            .filter((point) => point[1] > 0)

          if (sortedClashPoints[0]) {
            drawLine(startPointCoord, sortedClashPoints[0][0])
            map.set(sortedClashPoints[0][0], (map.get(sortedClashPoints[0][0]) || 0) + 1)
          }
          if (sortedClashPoints[1]) {
            drawLine(startPointCoord, sortedClashPoints[1][0])
            map.set(sortedClashPoints[1][0], (map.get(sortedClashPoints[1][0]) || 0) + 1)
          }

          map.delete(startPointCoord)
        }
      })
    }

    onMounted(() => {
      context.value = mapCanvas.value?.getContext('2d') || undefined
      render()
    })

    return {
      mapCanvas,
      useMapStore,
      clashPointsAmount
    }
  }
})
</script>

<style scoped>
.MapCanvas {
  border: 1px solid var(--vt-c-divider-light-1);
  margin-left: 40px;
}
</style>
@/utilsss
