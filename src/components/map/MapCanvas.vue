<template>
  Points amount: {{ clashPointsAmount }}
  <canvas id="mapCanvas" ref="mapCanvas" :width="width" :height="height" :class="$options.className" />
</template>

<script lang="ts">
type Coords = [number, number]
type ClashPoints = [Coords, number]
type ClashLine = [Coords, Coords]
type ClashLineArray = [ClashLine, number]

import type { Ref } from 'vue'
import { defineComponent, onMounted, ref } from 'vue'
import { MapColorScheme } from './MapStyle'
import { useMapStore } from '@/stores/map'
import { getRandomInt, doLineSegmentsIntersect } from '@/utils'

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
      clashPoints: Map<Coords, number> = new Map(),
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

      const calcDistance = function (coordsStart: Coords, coordsEnd: Coords): number {
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
      function addClashPoint(coords: Coords) {
        clashPoints.set(coords, 0)
        mapStore.updatePoint(coords, {
          height: maxHeight,
          color: colorScheme.colorHeight(maxHeight)
        })
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
        let sortedClashPoints: ClashPoints[] = Array.from(map.entries()).filter((clashPoint) => clashPoint[0] != startPointCoord)

        sortedClashPoints.forEach((clashPoint) => {
          if (!borderLine(startPointCoord, clashPoint[0])) {
            clashLines.set([startPointCoord, clashPoint[0]], calcDistance(startPointCoord, clashPoint[0]))
          }
        })

        map.delete(startPointCoord)
      })

      clashLines.forEach((lineDistance, lineCoords, map) => {
        let filteredClashLines: ClashLineArray[] = Array.from(map.entries()).filter((clashLine) => (clashLine[0][0] != lineCoords[0]) && (clashLine[0][0] != lineCoords[1]) && (clashLine[0][1] != lineCoords[1]) && (clashLine[0][1] != lineCoords[0]))
        filteredClashLines = filteredClashLines.filter((clashLine) => { //intersection
          const intersect = doLineSegmentsIntersect(
            { x: lineCoords[0][0], y: lineCoords[0][1] },
            { x: lineCoords[1][0], y: lineCoords[1][1] },
            { x: clashLine[0][0][0], y: clashLine[0][0][1] },
            { x: clashLine[0][1][0], y: clashLine[0][1][1] }
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
