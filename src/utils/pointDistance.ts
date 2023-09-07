type Coords = [number, number]
export const pointDistance = function (coordsStart: Coords, coordsEnd: Coords): number {
  return Math.sqrt(
    Math.pow(coordsEnd[0] - coordsStart[0], 2) + Math.pow(coordsEnd[1] - coordsStart[1], 2)
  )
}
