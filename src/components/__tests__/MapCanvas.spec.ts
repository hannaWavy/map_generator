import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import MapCanvas from '@/components/map/MapCanvas.vue'

describe('MapCanvas', () => {
  it('set size', () => {
    const wrapper = mount(MapCanvas, { props: { width: 300, height: 600 } })
    expect(wrapper.find('canvas').attributes('width')).toBe('300')
    expect(wrapper.find('canvas').attributes('height')).toBe('600')
  })
})
