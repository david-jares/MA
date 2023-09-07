import type { Rectangle } from "./utilityfunctions";

export type Point = {
  x: number;
  y: number;
};

export type Triangle = { p1: Point, p2: Point, p3: Point };


// WARNING - DOESNT WORK RELIABLY !!!!
export function isPointInsideTriangle(point: Point, triangle: Triangle): boolean {
  const { p1, p2, p3 } = triangle;
  const d1 = sign(point, p1, p2);
  const d2 = sign(point, p2, p3);
  const d3 = sign(point, p3, p1);
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(hasNeg && hasPos);
}

function sign(p1: Point, p2: Point, p3: Point): number {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}


export function isPointInsideRectangle(point: Point, rectangle: Rectangle): boolean {
  const { x, y, width, height } = rectangle;
  return (point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height);
}


/**
 * Checks if a point is inside a triangle or exactly on one of its edges.
 *
 * @param {Point} p The point to be checked.
 * @param {Point} a First vertex of the triangle.
 * @param {Point} b Second vertex of the triangle.
 * @param {Point} c Third vertex of the triangle.
 * @returns {boolean} True if the point is inside or on an edge of the triangle.
 */
export function isPointInOrOnTriangle(p: Point, tr: Triangle): boolean {
  const { p1: a, p2: b, p3: c } = tr;
  // Calculate barycentric coordinates
  const denominator = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  const u = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / denominator;
  const v = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / denominator;
  const w = 1 - u - v;

  // Check if the point is inside the triangle or on its boundary
  return (u >= 0 && u <= 1) && (v >= 0 && v <= 1) && (w >= 0 && w <= 1);
}



class Point2 {
  constructor(public x: number, public y: number) {}

  distanceTo(other: Point2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

