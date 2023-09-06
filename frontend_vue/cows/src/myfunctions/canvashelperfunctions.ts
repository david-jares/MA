import type { Point } from "./tempfunctions";

// export let coordinateOrigin = { x: 0, y: 0 };
export let origin = { x: 0, y: 0 };
export let scale = 3;
export const degreeLongitudeToMeters = 72186; // in Nürnberg Germany
export const degreeLatitideToMeters = 110000; // in Nürnberg Germany

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


export function moveOrigin(x: number, y: number): void {
  origin.x += x;
  origin.y += y;
}
export function setOrigin(x: number, y: number): void {
  origin.x = x;
  origin.y = y;
}

export function setScale(s: number): void {
  if (s < 0.1) {
    scale = 0.1;
  } else {
    scale = s;
  }
}

export function addToScale(s: number): void {
  if (scale + s < 0.1) {
    scale = 0.1;
  } else {
    scale += s;
  }
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

export function getPointsYInv(ctx: CanvasRenderingContext2D, points: Point[]): Point[] {
  return points.map(p => getPointYInv(ctx, p));
}

export function getPointScaled(ctx: CanvasRenderingContext2D, p: Point): Point {
  let p2: Point = { x: p.x, y: p.y };
  p2.x *= scale;
  p2.y *= scale;
  p2 = { x: p2.x + origin.x, y: p2.y + origin.y };
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
  drawLine(ctx, { x: origin.x, y: origin.y }, { x: origin.x + ctx.canvas.width * scale, y: origin.y });

  // Draw the y-axis
  drawLine(ctx, { x: origin.x, y: origin.y }, { x: origin.x, y: origin.y + ctx.canvas.height * scale });

  // Draw the text
  setFontProperties(ctx, "black", 12, "Arial");
  // Draw the tick marks and labels on the x-axis
  for (let i = 0; i < ctx.canvas.width / spacing; i++) {
    drawLine(ctx, { x: origin.x + i * spacing * scale, y: origin.y - 5 }, { x: origin.x + i * spacing * scale, y: origin.y + 5 });
    drawText(ctx, (i * spacing).toString(), origin.x + i * spacing * scale, origin.y + 20);
  }

  // Draw the tick marks and labels on the y-axis
  for (let i = 0; i < ctx.canvas.height / spacing; i++) {
    drawLine(ctx, { x: origin.x - 5, y: origin.y + i * spacing * scale }, { x: origin.x + 5, y: origin.y + i * spacing * scale });
    drawText(ctx, (i * spacing).toString(), origin.x + 20, origin.y + i * spacing * scale);
  }
}

export function drawCoordinateSystemYInv(ctx: CanvasRenderingContext2D): void {

  let spacing = 100;
  let h = ctx.canvas.height;
  // Set the line color to black
  setStrokeProperties(ctx, "black", 1);

  // Draw the x-axis
  drawLineYInv(ctx, { x: origin.x, y: origin.y }, { x: origin.x + ctx.canvas.width * scale, y: origin.y });

  // Draw the y-axis
  drawLineYInv(ctx, { x: origin.x, y: origin.y }, { x: origin.x, y: origin.y + ctx.canvas.height * scale });

  // Draw the text
  setFontProperties(ctx, "black", 12, "Arial");
  // Draw the tick marks and labels on the x-axis
  for (let i = 0; i < ctx.canvas.width / spacing; i++) {
    drawLineYInv(ctx, { x: origin.x + i * spacing * scale, y: origin.y - 5 }, { x: origin.x + i * spacing * scale, y: origin.y + 5 });
    drawTextYInv(ctx, (i * spacing).toString(), origin.x + i * spacing * scale, origin.y + 20);
  }

  // Draw the tick marks and labels on the y-axis
  for (let i = 0; i < ctx.canvas.height / spacing; i++) {
    drawLineYInv(ctx, { x: origin.x - 5, y: origin.y + i * spacing * scale }, { x: origin.x + 5, y: origin.y + i * spacing * scale });
    drawTextYInv(ctx, (i * spacing).toString(), origin.x + 20, origin.y + i * spacing * scale);
  }
}


export function drawPath(ctx: CanvasRenderingContext2D, path: Point[], closePath: boolean = true, fillArea: boolean = true, offset: Point = { x: 0, y: 0 }): void {

  ctx.beginPath();

  path.forEach((point, index) => {
    let transformedPoint: Point = { x: point.x + offset.x, y: point.y + offset.y };
    if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
    else ctx.lineTo(transformedPoint.x, transformedPoint.y);
    drawText(ctx, index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);

    if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
    else ctx.lineTo(transformedPoint.x, transformedPoint.y);
    drawText(ctx, index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);
  });
  if (closePath) ctx.closePath();
  if (fillArea) {
    ctx.fill();
  }
  else {
    ctx.stroke();
  }
}
// export function drawPathToCanvasScaled(ctx: CanvasRenderingContext2D, path: Point[]): void {
//   // ctx.strokeStyle = "black";

//   ctx.beginPath();

//   path.forEach((point, index) => {
//     let transformedPoint: Point = { x: point.x, y: point.y };
//     transformedPoint.x *= scale;
//     transformedPoint.y *= scale;
//     transformedPoint = { x: transformedPoint.x + origin.x, y: transformedPoint.y + origin.y };
//     if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
//     else ctx.lineTo(transformedPoint.x, transformedPoint.y);
//     drawText(ctx, index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);

//     if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
//     else ctx.lineTo(transformedPoint.x, transformedPoint.y);
//     drawText(ctx, index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);
//   });
//   ctx.closePath();
//   ctx.fill();
// }


export function drawRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillColor: string): void {
  ctx.strokeRect(x, y, width, height);
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
  }
}

// export function drawRectangleScaled(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillColor: string): void {
//   let x1 = origin.x + x * scale;
//   let y1 = origin.y + y * scale;
//   let w = width * scale;
//   let h = height * scale;
//   ctx.strokeRect(x1, y1, w, h);
//   if (fillColor) {
//     ctx.fillStyle = fillColor;
//     ctx.fillRect(x1 + 2, y1 + 2, w - 4, h - 4);
//   }

// }