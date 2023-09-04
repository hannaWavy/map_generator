import { describe, it, expect } from 'vitest'
import { MapColorScheme } from '@/components/map/MapStyle'

describe('Map Color Scheme', () => {
  it('correct color', () => {
    const minHeight = -1000,
      maxHeight = 1000
    const colorScheme = new MapColorScheme({ minHeight, maxHeight })
    const step = colorScheme.step

    expect(colorScheme.colorHeight(minHeight)).toBe(colorScheme.HEIGHT_COLORS[0])
    expect(colorScheme.colorHeight(minHeight - 10)).toBe(colorScheme.HEIGHT_COLORS[0])
    expect(colorScheme.colorHeight(minHeight + step + 1)).toBe(colorScheme.HEIGHT_COLORS[1])

    expect(colorScheme.colorHeight(maxHeight)).toBe(
      colorScheme.HEIGHT_COLORS[colorScheme.HEIGHT_COLORS.length - 1]
    )
    expect(colorScheme.colorHeight(maxHeight + 10)).toBe(
      colorScheme.HEIGHT_COLORS[colorScheme.HEIGHT_COLORS.length - 1]
    )
    expect(colorScheme.colorHeight(maxHeight - step + 1)).toBe(
      colorScheme.HEIGHT_COLORS[colorScheme.HEIGHT_COLORS.length - 1]
    )
    expect(colorScheme.colorHeight(maxHeight - step - 1)).toBe(
      colorScheme.HEIGHT_COLORS[colorScheme.HEIGHT_COLORS.length - 2]
    )
  })
})
