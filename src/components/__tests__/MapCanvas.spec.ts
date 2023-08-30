import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import MapCanvas from '../map/MapCanvas.vue'

describe('MapCanvas', () => {
  it('set size', () => {
    const wrapper = mount(MapCanvas, { props: { width: 300, height: 600 } })
    expect(wrapper.attributes('width')).toBe('300')
    expect(wrapper.attributes('height')).toBe('600')
  })
})
