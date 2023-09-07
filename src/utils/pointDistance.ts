export const pointDistance = function (coordsStart: Coordinates, coordsEnd: Coordinates): number {
  return Math.sqrt(
    Math.pow(coordsEnd.x - coordsStart.x, 2) + Math.pow(coordsEnd.y - coordsStart.y, 2)
  )
}
