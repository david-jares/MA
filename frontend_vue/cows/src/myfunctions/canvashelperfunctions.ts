import { ref } from "vue";
import { Triangle, type Point } from "./tempfunctions";
import type { GeoCoordinate } from "./model";
import { Rectangle } from "./utilityfunctions";

// export let coordinateOrigin = { x: 0, y: 0 };
export let origin = ref({ x: 0, y: 0 });
export let scale = ref(1);
export const degreeLongitudeToMeters = 72186; // in Nürnberg Germany
export const degreeLatitideToMeters = 110000; // in Nürnberg Germany

export function canvasPointToGeoCoordinate(ctx: CanvasRenderingContext2D, p: Point): GeoCoordinate {
  let geoCoordinate = { lat: 0, lon: 0 };
  geoCoordinate.lat = (p.y - origin.value.y) / scale.value / degreeLatitideToMeters;
  // geoCoordinate.lon = (p.x - origin.value.x) / scale.value / degreeLongitudeToMeters;
  return geoCoordinate;
}

//STYLING-------------------------------------------------------------------------
export function setStrokeProperties(ctx: CanvasRenderingContext2D, borderColor: string, borderThickness: number = 1): void {
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderThickness;
}

export function setFontProperties(ctx: CanvasRenderingContext2D, fontColor: string, fontSize: number = 12, fontFamily: string = "Arial"): void {
  ctx.fillStyle = fontColor;
  ctx.font = `${fontSize}px ${fontFamily}`;
}

export function setFillColor(ctx: CanvasRenderingContext2D, fillColor: string): void {
  ctx.fillStyle = fillColor;
}
//STYLING-------------------------------------------------------------------------
export function scalePointMultiply(point: Point) {
  return { x: point.x * scale.value, y: point.y * scale.value };
}

export function subtractOrigin(point: Point): Point {
  return { x: point.x - origin.value.x, y: point.y - origin.value.y };
}
export function addOrigin(point: Point): Point {
  return { x: point.x + origin.value.x, y: point.y + origin.value.y };
}
export function moveOrigin(x: number, y: number): void {
  origin.value.x += x;
  origin.value.y += y;
}
export function setOrigin(x: number, y: number): void {
  origin.value.x = x;
  origin.value.y = y;
}

export function setScale(s: number): void {
  if (s < 0.1) {
    scale.value = 0.1;
  } else {
    scale.value = s;
  }
}

export function addToScale(s: number): void {
  if (scale.value + s < 0.1) {
    scale.value = 0.1;
  } else {
    scale.value += s;
  }
}

export function getPointScaledAndOrigin(ctx: CanvasRenderingContext2D, p: Point): Point {
  return addOrigin(scalePointMultiply(p));
}
export function getPointsScaledAndOrigin(ctx: CanvasRenderingContext2D, points: Point[]): Point[] {
  return points.map((p) => getPointScaledAndOrigin(ctx, p));
}
export function getTriangleScaledAndOrigin(ctx: CanvasRenderingContext2D, triangle:Triangle): Triangle {
  // return points.map((p) => getPointScaledAndOrigin(ctx, p));
  return new Triangle(getPointScaledAndOrigin(ctx, triangle.p1), getPointScaledAndOrigin(ctx, triangle.p2), getPointScaledAndOrigin(ctx, triangle.p3));
}

// export function getRectScaledAndOrigin(ctx: CanvasRenderingContext2D, rectangle: Rectangle): Rectangle {
//   return new Rectangle(
//     rectangle.id,
//     getPointScaledAndOrigin(ctx, rectangle.p1),
//     getPointScaledAndOrigin(ctx, rectangle.p1),
//     getPointScaledAndOrigin(ctx, rectangle.p1),
//     getPointScaledAndOrigin(ctx, rectangle.p1),
//     )
// }

export function getYInv(ctx: CanvasRenderingContext2D, y: number): number {
  let h = ctx.canvas.height;
  return h - y;
}

export function getPointYInv(ctx: CanvasRenderingContext2D, p: Point): Point {
  // let h = ctx.canvas.height;
  let pYInv = { x: p.x, y: getYInv(ctx, p.y) };
  return { x: pYInv.x, y: pYInv.y };
}

export function getTriangleYInv(ctx: CanvasRenderingContext2D, t: Triangle): Triangle {
  return new Triangle(getPointYInv(ctx, t.p1), getPointYInv(ctx, t.p2), getPointYInv(ctx, t.p3));
}

export function getRectYInv(ctx: CanvasRenderingContext2D, r: Rectangle): Rectangle {
  let h = ctx.canvas.height;
  return new Rectangle(r.id, r.x, getYInv(ctx, r.y) - r.height, r.width, r.height);
}

export function getPointsYInv(ctx: CanvasRenderingContext2D, points: Point[]): Point[] {
  return points.map(p => getPointYInv(ctx, p));
}

export function getPointScaled(ctx: CanvasRenderingContext2D, p: Point): Point {
  let p2: Point = { x: p.x, y: p.y };
  p2.x *= scale.value;
  p2.y *= scale.value;
  p2 = { x: p2.x + origin.value.x, y: p2.y + origin.value.y };
  return p2;
}
export function getPointsScaled(ctx: CanvasRenderingContext2D, points: Point[]): Point[] {
  return points.map(p => getPointScaled(ctx, p));
}

export function getPointScaledYInv(ctx: CanvasRenderingContext2D, p: Point): Point {
  return getPointYInv(ctx, getPointScaled(ctx, p));
}

export function getPointsScaledYInv(ctx: CanvasRenderingContext2D, points: Point[]): Point[] {
  return points.map(p => getPointScaledYInv(ctx, p));
}

export function drawPoint(ctx: CanvasRenderingContext2D, p: Point, radius = 3, fill = true): void {
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  if (fill) {
    ctx.fill();
  }
}

export function drawLine(ctx: CanvasRenderingContext2D, p1: Point, p2: Point): void {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}
export function drawLineYInv(ctx: CanvasRenderingContext2D, p1: Point, p2: Point): void {
  let p1Inv = getPointYInv(ctx, p1);
  let p2Inv = getPointYInv(ctx, p2);
  ctx.beginPath();
  ctx.moveTo(p1Inv.x, p1Inv.y);
  ctx.lineTo(p2Inv.x, p2Inv.y);
  ctx.stroke();
}

export function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
  ctx.fillText(text, x, y);
}
export function drawTextYInv(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
  // let h = ctx.canvas.height;
  let yInv = getYInv(ctx, y);
  ctx.fillText(text, x, yInv);
}

export function drawCoordinateSystem(ctx: CanvasRenderingContext2D): void {

  let spacing = 100;
  // Set the line color to black
  setStrokeProperties(ctx, "black", 1);

  // Draw the x-axis
  drawLine(ctx, { x: origin.value.x, y: origin.value.y }, { x: origin.value.x + ctx.canvas.width * scale.value, y: origin.value.y });

  // Draw the y-axis
  drawLine(ctx, { x: origin.value.x, y: origin.value.y }, { x: origin.value.x, y: origin.value.y + ctx.canvas.height * scale.value });

  // Draw the text
  setFontProperties(ctx, "black", 12, "Arial");
  // Draw the tick marks and labels on the x-axis
  for (let i = 0; i < ctx.canvas.width / spacing; i++) {
    drawLine(ctx, { x: origin.value.x + i * spacing * scale.value, y: origin.value.y - 5 }, { x: origin.value.x + i * spacing * scale.value, y: origin.value.y + 5 });
    drawText(ctx, (i * spacing).toString(), origin.value.x + i * spacing * scale.value, origin.value.y + 20);
  }

  // Draw the tick marks and labels on the y-axis
  for (let i = 0; i < ctx.canvas.height / spacing; i++) {
    drawLine(ctx, { x: origin.value.x - 5, y: origin.value.y + i * spacing * scale.value }, { x: origin.value.x + 5, y: origin.value.y + i * spacing * scale.value });
    drawText(ctx, (i * spacing).toString(), origin.value.x + 20, origin.value.y + i * spacing * scale.value);
  }
}

export function drawCoordinateSystemYInv(ctx: CanvasRenderingContext2D): void {

  let spacing = 100;
  let h = ctx.canvas.height;
  // Set the line color to black
  setStrokeProperties(ctx, "black", 1);

  // Draw the x-axis
  drawLineYInv(ctx, { x: origin.value.x, y: origin.value.y }, { x: origin.value.x + ctx.canvas.width * scale.value, y: origin.value.y });

  // Draw the y-axis
  drawLineYInv(ctx, { x: origin.value.x, y: origin.value.y }, { x: origin.value.x, y: origin.value.y + ctx.canvas.height * scale.value });

  // Draw the text
  setFontProperties(ctx, "black", 12, "Arial");
  // Draw the tick marks and labels on the x-axis
  for (let i = 0; i < ctx.canvas.width / spacing; i++) {
    drawLineYInv(ctx, { x: origin.value.x + i * spacing * scale.value, y: origin.value.y - 5 }, { x: origin.value.x + i * spacing * scale.value, y: origin.value.y + 5 });
    drawTextYInv(ctx, (i * spacing).toString(), origin.value.x + i * spacing * scale.value, origin.value.y + 20);
  }

  // Draw the tick marks and labels on the y-axis
  for (let i = 0; i < ctx.canvas.height / spacing; i++) {
    drawLineYInv(ctx, { x: origin.value.x - 5, y: origin.value.y + i * spacing * scale.value }, { x: origin.value.x + 5, y: origin.value.y + i * spacing * scale.value });
    drawTextYInv(ctx, (i * spacing).toString(), origin.value.x + 20, origin.value.y + i * spacing * scale.value);
  }
}


export function drawPath(ctx: CanvasRenderingContext2D, path: Point[], closePath: boolean = true, fillArea: boolean = true, offset: Point = { x: 0, y: 0 }): void {

  ctx.beginPath();

  path.forEach((point, index) => {
    let transformedPoint: Point = { x: point.x + offset.x, y: point.y + offset.y };
    if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
    else ctx.lineTo(transformedPoint.x, transformedPoint.y);
    // drawText(ctx, index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);

    if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
    else ctx.lineTo(transformedPoint.x, transformedPoint.y);
    // drawText(ctx, index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);
  });
  if (closePath) ctx.closePath();
  if (fillArea) {
    ctx.fill();
  }
  else {
    ctx.stroke();
  }
}


export function drawRectangleDefault(ctx: CanvasRenderingContext2D, rectangle: Rectangle, fillArea: boolean = true): void {
  const { x, y, width, height } = rectangle;
  ctx.strokeRect(x, y, width, height);
  if (fillArea) {
    // ctx.fillStyle = fillColor;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
  }
}

export function drawRectangleYInv(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillArea: boolean = true): void {
  y = getYInv(ctx, y + height);
  setStrokeProperties(ctx, "black", 1);
  ctx.strokeRect(x, y, width, height);
  if (fillArea) {
    // ctx.fillStyle = fillColor;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
  }
}
