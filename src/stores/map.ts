import { defineStore } from 'pinia'

type PointProps = { height: number; color: number }
type Point = [number, number] //height, color
type Size = { width: number; height: number }
//type Position = { x: number; y: number }

// const COLOR_MASK = 0x0000ffffff
// const HEIGHT_MASK = 0xffff000000
// const HEIGHT_SHIFT = 24

// export function setHeight(pointAttrs: number, height: number) {
//   return (COLOR_MASK & pointAttrs) | (height << HEIGHT_SHIFT)
// }

// export function getHeight(pointAttrs: number) {
//   return ((HEIGHT_MASK & pointAttrs) >> HEIGHT_SHIFT).toString(10)
// }

export const useMapStore = defineStore({
  id: 'map',
  state: () => ({
    points: [] as Point[],
    size: { width: 0, height: 0 } as Size
  }),
  actions: {
    //TODO: unsafe order, unsafe position
    addPoint(pointAttrs: PointProps) {
      if (pointAttrs.color < 0 || pointAttrs.color > 16777215) pointAttrs.color = 0
      this.points.push([pointAttrs.height, pointAttrs.color])
    },
    // addPoints(pointAttrs: PointProps[]) {
    //   pointAttrs.forEach((point) => {
    //     this.addPoint(point)
    //   })
    // },
    setSize(size: Size) {
      this.size = size
    },

    getPoint(pointPosition: Point): PointProps | undefined {
      if (!this.size.width || !this.size.height) return
      if (pointPosition[0] > this.size.width) return
      if (pointPosition[1] > this.size.height) return

      const point = this.points[pointPosition[0] * this.size.height + pointPosition[1]]
      return { height: point[0], color: point[1] }
    },

    updatePoint(pointPosition: Point, pointAttrs: PointProps) {
      if (!this.size.width || !this.size.height) return
      if (pointPosition[0] > this.size.width) return
      if (pointPosition[1] > this.size.height) return

      const pointIndex = pointPosition[0] * this.size.height + pointPosition[1]
      this.points[pointIndex] = [pointAttrs.height, pointAttrs.color]
      return pointAttrs
    }
  }
})
