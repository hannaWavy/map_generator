/**
 * @author Peter Kelley
 * @author pgkelley4@gmail.com
 */

/**
 * See if two line segments intersect. This uses the
 * vector cross product approach described below:
 * http://stackoverflow.com/a/565282/786339
 *
 * @param {Object} p point object with x and y coordinates
 *  representing the start of the 1st line.
 * @param {Object} p2 point object with x and y coordinates
 *  representing the end of the 1st line.
 * @param {Object} q point object with x and y coordinates
 *  representing the start of the 2nd line.
 * @param {Object} q2 point object with x and y coordinates
 *  representing the end of the 2nd line.
 */

export function doLineSegmentsIntersect(
  p: Coordinates,
  p2: Coordinates,
  q: Coordinates,
  q2: Coordinates
) {
  const r = subtractPoints(p2, p)
  const s = subtractPoints(q2, q)

  const uNumerator = crossProduct(subtractPoints(q, p), r)
  const denominator = crossProduct(r, s)

  if (uNumerator == 0 && denominator == 0) {
    // They are coLlinear

    // Do they touch? (Are any of the points equal?)
    if (equalPoints(p, q) || equalPoints(p, q2) || equalPoints(p2, q) || equalPoints(p2, q2)) {
      return true
    }
    // Do they overlap? (Are all the point differences in either direction the same sign)
    return (
      !allEqual(q.x - p.x < 0, q.x - p2.x < 0, q2.x - p.x < 0, q2.x - p2.x < 0) ||
      !allEqual(q.y - p.y < 0, q.y - p2.y < 0, q2.y - p.y < 0, q2.y - p2.y < 0)
    )
  }

  if (denominator == 0) {
    // lines are paralell
    return false
  }

  const u = uNumerator / denominator
  const t = crossProduct(subtractPoints(q, p), s) / denominator

  return t >= 0 && t <= 1 && u >= 0 && u <= 1
}

/**
 * Calculate the cross product of the two points.
 *
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 *
 * @return the cross product result as a float
 */
function crossProduct(point1: Coordinates, point2: Coordinates) {
  return point1.x * point2.y - point1.y * point2.x
}

/**
 * Subtract the second point from the first.
 *
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 *
 * @return the subtraction result as a point object
 */
function subtractPoints(point1: Coordinates, point2: Coordinates): Coordinates {
  const result: Coordinates = { x: 0, y: 0 }
  result.x = point1.x - point2.x
  result.y = point1.y - point2.y

  return result
}

/**
 * See if the points are equal.
 *
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 *
 * @return if the points are equal
 */
function equalPoints(point1: Coordinates, point2: Coordinates): boolean {
  return point1.x == point2.x && point1.y == point2.y
}

/**
 * See if all arguments are equal.
 *
 * @param {...} args arguments that will be compared by '=='.
 *
 * @return if all arguments are equal
 */
function allEqual(...args): boolean {
  const firstValue = args[0]

  for (let i = 1; i < arguments.length; i += 1) {
    if (args[i] != firstValue) {
      return false
    }
  }
  return true
}
