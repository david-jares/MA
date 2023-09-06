import type { Point } from "./tempfunctions";

export const testvalue = 42;

//STYLING-------------------------------------------------------------------------
function setStrokeProperties(ctx: CanvasRenderingContext2D, borderColor: string, borderThickness: number = 1): void {
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderThickness;
}

function setFontProperties(ctx: CanvasRenderingContext2D, fontColor: string, fontSize: number = 12, fontFamily: string = "Arial"): void {
  ctx.fillStyle = fontColor;
  ctx.font = `${fontSize}px ${fontFamily}`;
}

function setFillColor(ctx: CanvasRenderingContext2D, fillColor: string): void {
  ctx.fillStyle = fillColor;
}
//STYLING-------------------------------------------------------------------------

// export let coordinateOrigin = { x: 0, y: 0 };
export let coordinateOrigin = { x: 100, y: 100 };
export let scale = 1;
export function drawCoordinateSystem(ctx: CanvasRenderingContext2D, origin: { x: number, y: number }): void {

  let spacing = 100;
  // Set the line color to black
  setStrokeProperties(ctx, "black", 1);

  // Draw the x-axis
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(origin.x + ctx.canvas.width * scale, origin.y);
  ctx.stroke();

  // Draw the y-axis
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(origin.x, origin.y + ctx.canvas.height * scale);
  ctx.stroke();

  // Draw the text
  setFontProperties(ctx, "black", 12, "Arial");
  // Draw the tick marks and labels on the x-axis
  for (let i = 0; i < ctx.canvas.width / (spacing); i++) {
    ctx.beginPath();
    ctx.moveTo(origin.x + i * spacing * scale, origin.y - 5);
    ctx.lineTo(origin.x + i * spacing * scale, origin.y + 5);
    ctx.stroke();
    ctx.fillText((i * spacing).toString(), origin.x + i * spacing * scale, origin.y + 20);
  }

  // Draw the tick marks and labels on the y-axis
  for (let i = 0; i < ctx.canvas.height / spacing; i++) {
    ctx.beginPath();
    ctx.moveTo(origin.x - 5, origin.y + i * spacing * scale);
    ctx.lineTo(origin.y + 5, origin.y + i * spacing * scale);
    ctx.stroke();
    ctx.fillText((i * spacing).toString(), origin.x + 20, origin.y + i * spacing * scale);
  }
}


export function drawPolygonToCanvas(ctx: CanvasRenderingContext2D, polygon: Point[], offset: Point = { x: 0, y: 0 }): void {
  // ctx.strokeStyle = "black";

  ctx.beginPath();

  polygon.forEach((point, index) => {
    let transformedPoint: Point = { x: point.x + offset.x, y: point.y + offset.y };
    if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
    else ctx.lineTo(transformedPoint.x, transformedPoint.y);

    ctx.fillText(index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);
    if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
    else ctx.lineTo(transformedPoint.x, transformedPoint.y);

    ctx.fillText(index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);
  });
  ctx.closePath();
  setFillColor(ctx, 'rgba(255, 0, 0, 0.8)');
  ctx.fill();
}
export function drawPolygonToCanvasScaled(ctx: CanvasRenderingContext2D, polygon: Point[]): void {
  // ctx.strokeStyle = "black";

  ctx.beginPath();

  polygon.forEach((point, index) => {
    let transformedPoint: Point = { x: point.x, y: point.y };
    transformedPoint.x *= scale;
    transformedPoint.y *= scale;
    transformedPoint = { x: transformedPoint.x + coordinateOrigin.x, y: transformedPoint.y + coordinateOrigin.y };
    if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
    else ctx.lineTo(transformedPoint.x, transformedPoint.y);

    ctx.fillText(index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);
    if (index === 0) ctx.moveTo(transformedPoint.x, transformedPoint.y);
    else ctx.lineTo(transformedPoint.x, transformedPoint.y);

    ctx.fillText(index.toString(), transformedPoint.x + 5, transformedPoint.y - 5);
  });
  ctx.closePath();
  setFillColor(ctx, 'rgba(255, 0, 0, 0.8)');
  ctx.fill();
}


export function drawRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillColor: string): void {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
  }

}
export function drawRectangleScaled(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillColor: string): void {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 2;
  let x1 = coordinateOrigin.x + x * scale;
  let y1 = coordinateOrigin.y + y * scale;
  let w = width * scale;
  let h = height * scale;
  ctx.strokeRect(x1, y1, w, h);
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x1 + 2, y1 + 2, w - 4, h - 4);
  }

}