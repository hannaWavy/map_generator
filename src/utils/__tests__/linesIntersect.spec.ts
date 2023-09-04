/**
 * Tests for the line-segments-intersect.js JavaScript file.
 *
 * @author Peter Kelley
 *
 * Fixed for vitest by HannaWavy
 */
import { describe, it, expect } from 'vitest'
import { doLineSegmentsIntersect } from '@/utils'

describe('Lines intersection', () => {
  it('No intersect', () => {
    const p = { x: 0, y: 1 }
    const p2 = { x: 0, y: 3 }
    const q = { x: 1, y: 0 }
    const q2 = { x: 3, y: 0 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(false)
  })
  it('Intersect', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 3, y: 3 }
    const q = { x: 0, y: 2 }
    const q2 = { x: 2, y: 0 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Intersect with negatives', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: -3, y: -3 }
    const q = { x: 0, y: -2 }
    const q2 = { x: -2, y: 0 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Intersect at start point', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 2, y: 0 }
    const q = { x: 0, y: 0 }
    const q2 = { x: 0, y: 2 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Intersect at end point', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 2, y: 0 }
    const q = { x: 3, y: 3 }
    const q2 = { x: 2, y: 0 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('No intersect because parallel vertically', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 0, y: 3 }
    const q = { x: 2, y: 0 }
    const q2 = { x: 2, y: 3 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(false)
  })
  it('No intersect because parallel horizontally', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 3, y: 0 }
    const q = { x: 0, y: 1 }
    const q2 = { x: 3, y: 1 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(false)
  })
  it('No intersect because parallel diagonally', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 3, y: 3 }
    const q = { x: 1, y: 0 }
    const q2 = { x: 4, y: 3 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(false)
  })
  it('Collinear with overlap', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 3, y: 3 }
    const q = { x: 2, y: 2 }
    const q2 = { x: 5, y: 5 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Collinear with overlap at single point vertical', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 0, y: 2 }
    const q = { x: 0, y: 2 }
    const q2 = { x: 0, y: 4 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Collinear with overlap at single point horizontal', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 2, y: 0 }
    const q = { x: 2, y: 0 }
    const q2 = { x: 4, y: 0 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Collinear with overlap horizontal with negatives', () => {
    const p = { x: 1, y: 0 }
    const p2 = { x: -1, y: 0 }
    const q = { x: 2, y: 0 }
    const q2 = { x: 0, y: 0 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Collinear with overlap vertical', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 0, y: 2 }
    const q = { x: 0, y: 3 }
    const q2 = { x: 0, y: 4 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(false)
  })
  it('Collinear with overlap vertical reverse order', () => {
    const p = { x: 0, y: 2 }
    const p2 = { x: 0, y: 3 }
    const q = { x: 0, y: 0 }
    const q2 = { x: 0, y: 1 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(false)
  })
  it('Collinear with overlap reverse point order', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 3, y: 3 }
    const q = { x: 5, y: 5 }
    const q2 = { x: 2, y: 2 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Collinear without overlap', () => {
    const p = { x: 0, y: 0 }
    const p2 = { x: 3, y: 3 }
    const q = { x: 4, y: 4 }
    const q2 = { x: 6, y: 6 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(false)
  })
  it('Collinear with overlap at single point with negatives', () => {
    const p = { x: 0, y: -1 }
    const p2 = { x: 0, y: -2 }
    const q = { x: 0, y: -2 }
    const q2 = { x: 0, y: -3 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Collinear with overlap at single point reverse', () => {
    const p = { x: 0, y: 3 }
    const p2 = { x: 0, y: 2 }
    const q = { x: 0, y: 2 }
    const q2 = { x: 0, y: 1 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Collinear without overlap at single point with negatives', () => {
    const p = { x: 0, y: -1 }
    const p2 = { x: 0, y: -2 }
    const q = { x: 0, y: -3 }
    const q2 = { x: 0, y: -4 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(false)
  })
  it('Collinear with overlap with negatives', () => {
    const p = { x: 0, y: -1 }
    const p2 = { x: 0, y: -3 }
    const q = { x: 0, y: -2 }
    const q2 = { x: 0, y: -4 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
  it('Collinear, q is part of p', () => {
    const p = { x: 10, y: 0 }
    const p2 = { x: 40, y: 0 }
    const q = { x: 30, y: 0 }
    const q2 = { x: 20, y: 0 }
    expect(doLineSegmentsIntersect(p, p2, q, q2)).toBe(true)
  })
})
