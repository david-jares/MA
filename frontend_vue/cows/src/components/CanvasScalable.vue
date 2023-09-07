<script setup lang="ts">
import { degreeLongitudeToMeters, degreeLatitideToMeters, drawCoordinateSystemYInv, setFillColor, drawPath, getPointsScaledYInv, addToScale, moveOrigin, getYInv, origin, scale, canvasPointToGeoCoordinate, drawRectangle, getPointYInv, subtractOrigin, addOrigin, scalePointMultiply, setStrokeProperties } from '@/myfunctions/canvashelperfunctions';
import { drawTriangle, isInsidePolygon, isPointInTriangle, triangulatePolygon } from '@/myfunctions/drawingfunctions';
import type { GeoCoordinate } from '@/myfunctions/model';
import { isPointInOrOnTriangle, isPointInsideRectangle, isPointInsideTriangle, type Point, type Triangle } from '@/myfunctions/tempfunctions';
import { subdivideCanvas, type Rectangle } from '@/myfunctions/utilityfunctions';
import { useGlobalsStore } from '@/stores/globals';
import { onMounted, ref } from 'vue';

let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D | null;
const gs = useGlobalsStore();
const labelText = ref("mousecoordinates");
// testfunction();
// console.log(coordinateOrigin);
let coordShiftFromOrigin = ref({ x: 0, y: 0 });

let geoCoords = gs.coordinatesCombined;
let geoCoords_m = geoCoords.map((coord) => {
    return GeoCoordToMeters(coord);
});
const minX_m = Math.min(...geoCoords_m.map(coord => coord.x));
const maxX_m = Math.max(...geoCoords_m.map(coord => coord.x));
const minY_m = Math.min(...geoCoords_m.map(coord => coord.y));
const maxY_m = Math.max(...geoCoords_m.map(coord => coord.y));
console.log("minX_m: " + minX_m);
console.log("maxX_m: " + maxX_m);
console.log("minY_m: " + minY_m);
console.log("maxY_m: " + maxY_m);






let coordHeight_m = maxY_m - minY_m;
let coordWidth_m = maxX_m - minX_m;
coordShiftFromOrigin.value = { x: minX_m, y: minY_m };
// console.log("topLeft" + ShiftGeoCoordPointInMetersBackToCanvasSpace({ x: minX_m, y: maxY_m }));
// console.log(ShiftGeoCoordPointInMetersBackToCanvasSpace({ x: minX_m, y: maxY_m }));
// console.log("bottomRight" + ShiftGeoCoordPointInMetersBackToCanvasSpace({ x: maxX_m, y: minY_m }));
// console.log(ShiftGeoCoordPointInMetersBackToCanvasSpace({ x: maxX_m, y: minY_m }));
// console.log("coordWidth_m: " + coordWidth_m);
// console.log("coordHeight_m: " + coordHeight_m);

let geoCoordsShiftedBack_m = geoCoords_m.map((coord) => {
    return { x: coord.x - coordShiftFromOrigin.value.x, y: coord.y - coordShiftFromOrigin.value.y };
});
console.log("geoCoordsShiftedBack_m: ");
console.log(geoCoordsShiftedBack_m)
onMounted(() => {
    canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");

    let interval = setInterval(() => {
        if (ctx == null || canvas == null) { return; }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        drawCoordinateSystemYInv(ctx);
        setFillColor(ctx, "rgba(255,0,255,0.65)");
        drawPath(ctx, getPointsScaledYInv(ctx, geoCoordsShiftedBack_m));
        testRaster();
    }, 50);
    // testRaster();


    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp" && e.shiftKey) {
            addToScale(0.1);
        }
        else if (e.key == "ArrowDown" && e.shiftKey) {
            addToScale(-0.1);
        }
        else if (e.key == "ArrowUp") {
            moveOrigin(0, 50);
        }
        else if (e.key == "ArrowDown") {
            moveOrigin(0, -50);
        }
        else if (e.key == "ArrowLeft") {
            moveOrigin(-50, 0);
        }
        else if (e.key == "ArrowRight") {
            moveOrigin(50, 0);
        }
    });
    canvas.addEventListener("mousemove", (e) => {
        if (ctx == null || canvas == null) { return; }
        let mousePosYInv = { x: e.offsetX, y: getYInv(ctx, e.offsetY) };
        let mousePosGeoCoordsYInv = canvasPointToGeoCoord({ x: mousePosYInv.x, y: mousePosYInv.y });
        labelText.value = "mousecoordinates: " + mousePosYInv.x + ", " + mousePosYInv.y + " | lon:" + mousePosGeoCoordsYInv.lon + ", lat:" + mousePosGeoCoordsYInv.lat;
    });
});

function GeoCoordToMeters(coord: GeoCoordinate) {
    return { x: coord.lon * degreeLongitudeToMeters, y: coord.lat * degreeLatitideToMeters };
}

function ShiftGeoCoordPointInMetersBackToCanvasSpace(coordinate: Point) {
    return { x: coordinate.x - coordShiftFromOrigin.value.x, y: coordinate.y - coordShiftFromOrigin.value.y };
}

function canvasPointToGeoCoord(p: Point) {
    let lon = (((p.x - origin.value.x) / scale.value) + coordShiftFromOrigin.value.x) / degreeLongitudeToMeters;
    let lat = (((p.y - origin.value.y) / scale.value) + coordShiftFromOrigin.value.y) / degreeLatitideToMeters;
    return { lon: lon, lat: lat };
}

function testRaster() {
    // console.log("testRaster");

    // let rectangles = subdivideCanvas(canvas!, 40, 40);
    let rectangles: Rectangle[] = [];
    let padding = 20;
    let rasterSize = 20 * scale.value;
    let topLeft = ShiftGeoCoordPointInMetersBackToCanvasSpace({ x: minX_m - padding, y: maxY_m + padding });
    let bottomRight = ShiftGeoCoordPointInMetersBackToCanvasSpace({ x: maxX_m + padding, y: minY_m - padding });
    let rasterWidth = (bottomRight.x - topLeft.x) * scale.value;
    let rasterHeight = (topLeft.y - bottomRight.y) * scale.value;
    const numCols: number = Math.ceil(rasterWidth / rasterSize);
    const numRows: number = Math.ceil(rasterHeight / rasterSize);
    // console.log("numCols: " + numCols);
    // console.log("numRows: " + numRows);
    let id: number = 1;
    for (let row = 0; row <= numRows; row++) {
        for (let col = -1; col < numCols; col++) {
            const x: number = col * rasterSize + origin.value.x - padding;
            const y: number = row * rasterSize + origin.value.y - padding;
            rectangles.push({ id: id, x: x, y: y, width: rasterSize, height: rasterSize });
            id++;
        }
    }
    // console.log("rectangles");
    // console.log(rectangles);

    // filter rectanggles which are touching the polygon
    let triangles = triangulatePolygon(geoCoordsShiftedBack_m)

    setStrokeProperties(ctx!, "black", 1);
    let trianglesTransformed = triangles.map((triangle) => {
        // let p1 = getPointYInv(ctx!, (addOrigin(scalePointMultiply(triangle[0]))));
        // let p2 = getPointYInv(ctx!, (addOrigin(scalePointMultiply(triangle[1]))));
        // let p3 = getPointYInv(ctx!, (addOrigin(scalePointMultiply(triangle[2]))));
        let p1 = (addOrigin(scalePointMultiply(triangle.p1)));
        let p2 = (addOrigin(scalePointMultiply(triangle.p2)));
        let p3 = (addOrigin(scalePointMultiply(triangle.p3)));
        return [p1, p2, p3];
    });

    let trianglesTransformedYInv = trianglesTransformed.map((triangle) => {
        return [getPointYInv(ctx!, triangle[0]), getPointYInv(ctx!, triangle[1]), getPointYInv(ctx!, triangle[2])];
    });

    setStrokeProperties(ctx!, "red", 0.75);
    // console.log(rectangles);
    // console.log(triangles);
    // console.log(trianglesTransformed);
    rectangles.forEach(rectangle => {
        // if(isPointInsideTriangle(rectangle.,triangles[0])
        let isQualifiedRect = false;
        for (let i = 0; i < triangles.length; i++) {
            const triangle = triangles[i];
            // const triangleRev = [triangle[2], triangle[1], triangle[0]];
            // let tr = [[triangle[0].x,triangle[0].y], [triangle[1].x,triangle[1].y], [triangle[2].x,triangle[2].y]];
            if (
                isPointInOrOnTriangle({ x: rectangle.x, y: rectangle.y }, triangle) ||
                isPointInOrOnTriangle({ x: rectangle.x + rectangle.width, y: rectangle.y }, triangle) ||
                isPointInOrOnTriangle({ x: rectangle.x, y: rectangle.y + rectangle.height }, triangle) ||
                isPointInOrOnTriangle({ x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height}, triangle) ||
                isPointInsideRectangle(triangle.p1, rectangle) ||
                isPointInsideRectangle(triangle.p2, rectangle) ||
                isPointInsideRectangle(triangle.p3, rectangle) 


            ) {
                // console.log("isQualifiedRect");
                isQualifiedRect = true;
                break;
            }
        }
        if (isQualifiedRect) drawRectangle(ctx!, rectangle.x, getYInv(ctx!, rectangle.y), rectangle.width, rectangle.height, "rgba(255,0,0,0.1)");
        // drawRectangle(ctx!, rectangle.x, getYInv(ctx!, rectangle.y), rectangle.width, rectangle.height, "rgba(255,0,0,0.1)");
    });
    trianglesTransformedYInv.forEach((triangle) => {
        drawTriangle(ctx!, [triangle[0], triangle[1], triangle[2]]);
    });


    // // testing something
    // let rect : Rectangle = {id: 1, x: 0, y: 0, width: 200, height: 300};
    // drawRectangle(ctx!, rect.x, rect.y, rect.width, rect.height, "rgba(0,255,0,0.5)");
    // let triangle : Triangle = [{x: 100, y: 100}, {x: 500, y: 100}, {x: 100, y: 400}];
    // setFillColor(ctx!, "rgba(255,0,0,0.5)")
    // drawTriangle(ctx!, triangle);
    // let isInTriangle = isPointInsideTriangle({x: rect.x, y: rect.y}, [triangle[2],triangle[1],triangle[0]]);
    // console.log("isInTriangle: " + isInTriangle);
    // let isInTriangle2 = isPointInTriangle([rect.x + rect.width, rect.y+ rect.height], [[triangle[0].x,triangle[0].y], [triangle[1].x,triangle[1].y], [triangle[2].x,triangle[2].y]])
    // console.log("isInTriangle2: " + isInTriangle2);

    // let isInPolygon1 = isInsidePolygon({x: rect.x, y: rect.y}, triangle);
    // console.log("isInPolygon1: " + isInPolygon1);
    // let isInPolygon2 = isInsidePolygon({x: rect.x+rect.width, y: rect.y}, triangle);
    // console.log("isInPolygon2: " + isInPolygon2);
    // let isInPolygon3 = isInsidePolygon({x: rect.x, y: rect.y+ rect.height}, triangle);
    // console.log("isInPolygon3: " + isInPolygon3);
    // let isInPolygon4 = isInsidePolygon({x: rect.x+ rect.width, y: rect.y+ rect.height}, triangle);
    // console.log("isInPolygon4: " + isInPolygon4);

}


</script>

<template>
    <div>
        <canvas id="mycanvas" ref=canvas width="800" height="800" style="border:1px solid #000000;">
        </canvas>
        <label style="display: block; font-family: monospace;">{{ labelText }}</label>
        <label style="display: block; font-family: monospace;">origin: {{ origin }} | scale: {{ scale.toFixed(1) }} (1 pixel
            = {{ (1 / scale).toFixed(2) }} Meter )</label>
        <label style="display: block; font-family: monospace;">coordShiftFromOrigin: {{ coordShiftFromOrigin }}</label>
    </div>
</template>