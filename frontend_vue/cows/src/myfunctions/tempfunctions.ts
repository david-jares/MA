type Point = {
    x: number;
    y: number;
  };
  
  type Triangle = [Point, Point, Point];
  
  function isPointInsideTriangle(point: Point, triangle: Triangle): boolean {
    const [p1, p2, p3] = triangle;
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