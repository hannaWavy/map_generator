<template>
  Points amount: {{ clashPointsAmount }}
  <canvas id="mapCanvas" ref="mapCanvas" :width="width" :height="height" :class="$options.className" />
</template>

<script lang="ts">
type ClashPoints = [Coordinates, number]
type ClashLine = [Coordinates, Coordinates]
type ClashLineArray = [ClashLine, number]

import type { Ref } from 'vue'
import { defineComponent, onMounted, ref } from 'vue'
import { MapColorScheme } from './MapStyle'
import { useMapStore } from '@/stores/map'
import { randomInt, doLineSegmentsIntersect, pointDistance } from '@/utils'

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
      clashPoints: Map<Coordinates, number> = new Map(),
      clashLines: Map<ClashLine, number> = new Map()

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

      const drawPoint = function (position: Coordinates, color: number) {
        if (!context.value) return
        context.value.fillStyle = '#' + color.toString(16)
        context.value.fillRect(position.x, position.y, 1, 1)
      }

      const drawLine = function (startPosition: Coordinates, endPosition: Coordinates) {
        if (!context.value) return
        context.value.beginPath()
        context.value.moveTo(startPosition.x, startPosition.y)
        context.value.lineTo(endPosition.x, endPosition.y)
        context.value.stroke()
      }

      let color = colorScheme.colorHeight(),
        height = 0

      mapStore.setSize(props)

      for (let x = 0; x < props.width; x++) {
        for (let y = 0; y < props.height; y++) {
          //height = randomInt(minHeight, maxHeight);
          height = randomInt(-500, 0)
          color = colorScheme.colorHeight(height)
          mapStore.addPoint({ height, color })

          drawPoint({ x, y }, color)
        }
      }

      //lines
      function addClashPoint(coords: Coordinates) {
        clashPoints.set(coords, 0)
        mapStore.updatePoint(coords, {
          height: maxHeight,
          color: colorScheme.colorHeight(maxHeight)
        })
      }

      for (let c = 0; c < clashPointsAmount; c++) {
        addClashPoint({ x: randomInt(0, props.width), y: randomInt(0, props.height) })

        if (c % 5 === 0) {
          addClashPoint({ x: 0, y: randomInt(0, props.height) })
          addClashPoint({ x: randomInt(0, props.width), y: 0 })
          addClashPoint({ x: props.width, y: randomInt(0, props.height) })
          addClashPoint({ x: randomInt(0, props.width), y: props.height })
        }
      }

      function borderLine(startCoord: Coordinates, endCoord: Coordinates) {
        return (
          (startCoord.x === 0 && endCoord.x === 0) ||
          (startCoord.y === 0 && endCoord.y === 0) ||
          (startCoord.x === props.width && endCoord.x === props.width) ||
          (startCoord.y === props.height && endCoord.y === props.height)
        )
      }

      clashPoints.forEach((startPointConnections, startPointCoord, map) => {
        let sortedClashPoints: ClashPoints[] = Array.from(map.entries()).filter(
          (clashPoint) => clashPoint[0] != startPointCoord
        )

        sortedClashPoints.forEach((clashPoint) => {
          if (!borderLine(startPointCoord, clashPoint[0])) {
            clashLines.set(
              [startPointCoord, clashPoint[0]],
              pointDistance(startPointCoord, clashPoint[0])
            )
          }
        })

        map.delete(startPointCoord)
      })

      clashLines.forEach((lineDistance, lineCoords, map) => {
        let filteredClashLines: ClashLineArray[] = Array.from(map.entries()).filter(
          (clashLine) =>
            clashLine[0][0] != lineCoords[0] &&
            clashLine[0][0] != lineCoords[1] &&
            clashLine[0][1] != lineCoords[1] &&
            clashLine[0][1] != lineCoords[0]
        )
        filteredClashLines = filteredClashLines.filter((clashLine) => {
          //intersection
          const intersect = doLineSegmentsIntersect(
            lineCoords[0],
            lineCoords[1],
            clashLine[0][0],
            clashLine[0][1]
          )
          return intersect && clashLine[1] > lineDistance
        })

        if (filteredClashLines.length) {
          filteredClashLines.forEach((clashLine) => {
            map.delete(clashLine[0])
          })
        }
      })

      clashLines.forEach((lineDistance, lineCoords) => {
        drawLine(...lineCoords)
      })
    }

    onMounted(() => {
      const startTime = Date.now();
      context.value = mapCanvas.value?.getContext('2d') || undefined
      render()
      console.log(Date.now() - startTime)
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
