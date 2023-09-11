import { ref } from "vue";
import { Triangle, type Point, RasterizedRectangle } from "./tempfunctions";
import type { GeoCoordinate } from "./model";
import { Rectangle } from "./utilityfunctions";
import { useGlobalsStore } from "@/stores/globals";

// let gs = useGlobalsStore();

// export let coordinateOrigin = { x: 0, y: 0 };
export let origin = ref({ x: 0, y: 0 });
export let scale = ref(3);
// export let origin = ref({ x: -1000, y: 0 });
// export let scale = ref(10);
export const degreeLongitudeToMeters = 72186; // in Nürnberg Germany
export const degreeLatitideToMeters = 110000; // in Nürnberg Germany

export let coordShiftFromOrigin = ref({ x: 0, y: 0 });


export const barnRasterRectangle = new RasterizedRectangle(
  1,
  { lon: 12.198769833855735, lat: 49.68159673060605 },
  200, 100, 0, 5, 10
)

export let storedCanvasProperties: CanvasProperties | null = null;

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

interface CanvasProperties {
  borderColor?: string | CanvasGradient | CanvasPattern;
  borderThickness?: number;
  fontColor?: string | CanvasGradient | CanvasPattern;
  fontSize?: number;
  fontFamily?: string;
  fillColor?: string | CanvasGradient | CanvasPattern;
}

export function setCanvasProperties(ctx: CanvasRenderingContext2D, properties: CanvasProperties = {}): void {
  if (properties.borderColor) {
    ctx.strokeStyle = properties.borderColor;
  }
  if (properties.borderThickness) {
    ctx.lineWidth = properties.borderThickness;
  }
  if (properties.fontColor || properties.fontSize || properties.fontFamily) {
    const font = `${properties.fontSize ?? 12}px ${properties.fontFamily ?? "Arial"}`;
    ctx.font = font;
    if (properties.fontColor) {
      ctx.fillStyle = properties.fontColor;
    }
  }
  if (properties.fillColor) {
    ctx.fillStyle = properties.fillColor;
  }
}
export function saveCanvasProperties(ctx: CanvasRenderingContext2D) {
  storedCanvasProperties = {
    borderColor: ctx.strokeStyle,
    borderThickness: ctx.lineWidth,
    fontColor: ctx.fillStyle,
    fontSize: parseInt(ctx.font.split(" ")[0], 10),
    fontFamily: ctx.font.split(" ")[1],
    fillColor: ctx.fillStyle,
  };
}
export function restoreCanvasProperties(ctx: CanvasRenderingContext2D): void {
  if (storedCanvasProperties) setCanvasProperties(ctx, storedCanvasProperties);
}


//STYLING-------------------------------------------------------------------------

export function GeoCoordToCanvasPoint(geoCoord: GeoCoordinate) {
  let canvasPointX = (((degreeLongitudeToMeters * geoCoord.lon) - coordShiftFromOrigin.value.x) * scale.value) + origin.value.x;
  let canvasPointY = (((degreeLatitideToMeters * geoCoord.lat) - coordShiftFromOrigin.value.y) * scale.value) + origin.value.y;
  return { x: canvasPointX, y: canvasPointY };
}

export function canvasPointToGeoCoord(canvasPoint: Point) {
  let lon = (((canvasPoint.x - origin.value.x) / scale.value) + coordShiftFromOrigin.value.x) / degreeLongitudeToMeters;
  let lat = (((canvasPoint.y - origin.value.y) / scale.value) + coordShiftFromOrigin.value.y) / degreeLatitideToMeters;
  return { lon: lon, lat: lat };
}

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
export function getTriangleScaledAndOrigin(ctx: CanvasRenderingContext2D, triangle: Triangle): Triangle {
  // return points.map((p) => getPointScaledAndOrigin(ctx, p));
  return new Triangle(getPointScaledAndOrigin(ctx, triangle.p1), getPointScaledAndOrigin(ctx, triangle.p2), getPointScaledAndOrigin(ctx, triangle.p3));
}



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

export function getPolygonCenterPoint(path: Point[]): Point {
  let centerX = path.reduce((sum, current) => sum + current.x, 0) / path.length;
  let centerY = path.reduce((sum, current) => sum + current.y, 0) / path.length;
  let center = { x: centerX, y: centerY };
  return center;

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
  // else {
  ctx.stroke();
  // }
}


export function drawRectangleDefault(ctx: CanvasRenderingContext2D, rectangle: Rectangle, fillArea: boolean = true): void {
  const { x, y, width, height } = rectangle;
  ctx.strokeRect(x, y, width, height);
  if (fillArea) {
    // ctx.fillStyle = fillColor;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
  }
}

export function drawRotatedRectangle(ctx: CanvasRenderingContext2D, rectangle: Rectangle, fillArea: boolean = true, degrees: number = 0): void {
  const { x, y, width, height } = rectangle;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(degrees * Math.PI / 180);
  // ctx.strokeRect(x, y, width, height);
  if (fillArea) { ctx.fillRect(-width / 2, -height / 2, width, height) };
  ctx.restore();
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

export function drawSpaceRectangle(ctx: CanvasRenderingContext2D, rectangle: Rectangle) {
  let transformedRect = getRectYInv(ctx!, rectangle);
  // setFillColor(ctx!, "rgba(255,0,0,0.2)");
  drawRectangleDefault(ctx!, transformedRect, true);
  setFontProperties(ctx!, "rgba(0,0,255,0.7)", 4 * scale.value, "Arial");
  let text = rectangle.id.toString();
  drawText(ctx!, text, transformedRect.x + 1.5 * scale.value, transformedRect.y + 4 * scale.value);

}

export function drawRotatedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  angleDeg: number,
  width?: number,
  height?: number,
  alpha?: number
) {
  const angleRad = angleDeg * Math.PI / 180;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);
  if (alpha) {
    ctx.globalAlpha = alpha;
  }
  if (width && height) {
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
  } else {
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
  }
  ctx.restore();
}


export function getSubdividedRectangles(rect: Rectangle, rows: number, cols: number, angle: number): Rectangle[] {
  let nextRectID = 1000;
  const rectangles: Rectangle[] = [];
  const { x, y, width, height } = rect;
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
  const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);
  const cellWidth = rotatedWidth / cols;
  const cellHeight = rotatedHeight / rows;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellX = x + j * cellWidth * cos - i * cellHeight * sin;
      const cellY = y + j * cellWidth * sin + i * cellHeight * cos;
      rectangles.push(new Rectangle(nextRectID++, cellX, cellY, cellWidth, cellHeight));
    }
  }
  return rectangles;
}

// interface Point {
//   x: number;
//   y: number;
// }

export function generatePoints(
  point1: Point,
  point2: Point,
  subdivision: number,
  columnAmount: number,
  columnWidth: number
): Point[] {
  const points: Point[] = [];

  // Compute unit direction vector of the line
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / length;
  const uy = dy / length;

  // Compute unit normal vector (perpendicular) to the line
  const nx = -uy;
  const ny = ux;

  // Generate points on the subdivided line and parallel lines
  for (let i = 0; i <= subdivision; i++) {
    const ratio = i / subdivision;

    // Point on the main line
    const mx = point1.x + ratio * dx;
    const my = point1.y + ratio * dy;

    for (let j = 0; j < columnAmount; j++) {
      // Point on the parallel line
      const px = mx + j * columnWidth * nx;
      const py = my + j * columnWidth * ny;

      points.push({ x: px, y: py });
    }
  }

  return points;
}

type BarnRect = { topLeft: number, topRight: number, bottomLeft: number, bottomRight: number };

export function generatePointsAndRectangles(
  point1: Point,
  point2: Point,
  subdivision: number,
  columnAmount: number,
  columnWidth: number
): { points: Point[], rectangles: BarnRect[] } {
  const points: Point[] = [];
  const rectangles: BarnRect[] = [];

  // Compute unit direction vector of the line
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / length;
  const uy = dy / length;

  // Compute unit normal vector (perpendicular) to the line
  const nx = -uy;
  const ny = ux;

  // Generate points on the subdivided line and parallel lines
  let pointIndex = 0;
  for (let i = 0; i <= subdivision; i++) {
    const ratio = i / subdivision;

    // Point on the main line
    const mx = point1.x + ratio * dx;
    const my = point1.y + ratio * dy;

    for (let j = 0; j < columnAmount; j++) {
      // Point on the parallel line
      const px = mx + j * columnWidth * nx * scale.value;
      const py = my + j * columnWidth * ny * scale.value;

      points.push({ x: px, y: py });

      // Create rectangles
      if (i > 0 && j > 0) {
        rectangles.push({
          topLeft: pointIndex - columnAmount - 1,
          topRight: pointIndex - columnAmount,
          bottomLeft: pointIndex - 1,
          bottomRight: pointIndex
        });
      }

      pointIndex++;
    }
  }

  return { points, rectangles };
}

// // user drawn rectangles
// export function drawRectangleOnCanvas(canvas: HTMLCanvasElement) {
//   const ctx = canvas.getContext('2d');
//   let isDrawing = false;
//   let startX = 0;
//   let startY = 0;
//   let endX = 0;
//   let endY = 0;

//   function draw() {
//     // ctx!.clearRect(0, 0, canvas.width, canvas.height);
//     ctx!.beginPath();
//     ctx!.rect(startX, startY, endX - startX, endY - startY);
//     ctx!.stroke();
//   }

//   canvas.addEventListener('mousedown', (event) => {
//     // if (event.key === 'd') {
//       isDrawing = true;
//       startX = event.offsetX;
//       startY = event.offsetY;
//     // }
//   });

//   canvas.addEventListener('mousemove', (event) => {
//     if (isDrawing) {
//       endX = event.offsetX;
//       endY = event.offsetY;
//       draw();
//     }
//   });

//   canvas.addEventListener('mouseup', (event) => {
//     // if (event.key === 'd') {
//       isDrawing = false;
//       endX = event.offsetX;
//       endY = event.offsetY;
//       draw();
//     // }
//   });
// }