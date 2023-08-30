// stores/counter.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useMapStore } from '../../stores/map'

describe('Map Pointers Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('save point', () => {
    const mapPoints = useMapStore()
    expect(mapPoints.points).toStrictEqual([])

    mapPoints.addPoint({ height: 12, color: 0x0c84c7 })
    expect(mapPoints.points[0]).toStrictEqual([12, 0x0c84c7])

    mapPoints.addPoint({ height: 13, color: 16777216 })
    expect(mapPoints.points[1]).toStrictEqual([13, 0])
  })

  it('get point', () => {
    const mapPoints = useMapStore()
    expect(mapPoints.points).toStrictEqual([])

    const size = { width: 2, height: 4 }
    mapPoints.setSize(size)

    for (let x = 0; x < size.width; x++) {
      for (let y = 0; y < size.height; y++) {
        mapPoints.addPoint({ height: Number(String(x) + String(y)), color: x + y })
      }
    }

    expect(mapPoints.getPoint([1, 3])).toStrictEqual({ height: 13, color: 4 })
  })
})
